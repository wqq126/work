<template>
	<el-table id='tree' :data="formatData" :row-style="showRow" v-bind="$attrs" height="calc(100% - 90px - 2.5em)" highlight-current-row>
		<el-table-column v-if="columns.length===0" show-overflow-tooltip width="150">
			<template slot-scope="scope">
				<span v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
				<span class="tree-ctrl" v-if="iconShow(0,scope.row)" @click="toggleExpanded(scope.$index)">
        	<i class="iconfont icon-checkbox-uncheck"></i>
          <i v-if="!scope.row._expanded" class="iconfont icon-plus"></i>
          <i v-else class="iconfont icon-minus"></i>
        </span> {{scope.$index}}
			</template>
		</el-table-column>
		<el-table-column v-else v-for="(column, index) in columns" show-overflow-tooltip :key="column.value" :label="column.text" :width="column.width" :render-header='renderH'>
			<template slot-scope="scope">
				<span v-if="index === 0" v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
				<span class="tree-ctrl" v-if="index === 0" :class='{showF:!iconShow(index,scope.row)}' @click="toggleExpanded(scope.$index)">
		          <i v-show='!scope.row._expanded' class="iconfont icon-plus"></i>
		          <i v-show='scope.row._expanded' class="iconfont icon-minus"></i>
		        </span>
				<span v-if="index === 0"><i :groupId='scope.row.id' :parentId='scope.row.parentId' class="iconfont icon-checkbox-uncheck"></i>{{scope.row[column.value]}}</span> 
				<span v-if="index === 1">{{scope.row[column.value]}}</span> 
				<span v-if="index === 3">{{scope.row[column.value]}}</span> 
				
				<span v-if="index === 2 && scope.row[column.value] == 1">
					{{$t('message.deviceGroup.gradeOne')}}
				</span> 
				<span v-if="index === 2 && scope.row[column.value] == 2">
					{{$t('message.deviceGroup.gradeTwo')}}
				</span> 
				<span v-if="index === 2 && scope.row[column.value] == 3">
					{{$t('message.deviceGroup.gradeThree')}}
				</span> 
				<span v-if="index === 2 && scope.row[column.value] == 4">
					{{$t('message.deviceGroup.gradeFour')}}
				</span> 
				<span v-if="index === 2 && scope.row[column.value] == 5">
					{{$t('message.deviceGroup.gradeFif')}}
				</span> 
				<span v-if="index === 2 && scope.row[column.value] == 6">
					{{$t('message.deviceGroup.gradeSix')}}
				</span> 
				
				<!--增加同级-->
				<el-button v-if='index === 4' class='tableBtn' type="text" size="medium" @click="addPeersGroup(scope.row.parentId)">{{$t("message.deviceGroup.addPeers")}}</el-button>
				<!--//增加下级-->
				<el-button v-if='index === 4' class='tableBtn' size="medium" type="text"  @click="addChildGroup(scope.row.id)">{{$t("message.deviceGroup.addChildG")}}</el-button>
				<!--导入设备-->
				<el-button v-if='index === 4' class="tableBtn" @click='transToGroup(scope.row.id)' type="text" size="medium">{{$t("message.deviceGroup.transferDev")}}</el-button>
				<!--编辑-->
				<el-button v-if='index === 4' class="tableBtn" @click='editGroup(scope.row.id, scope.row.displayGroup, scope.row.parentId)' type="text" 					size="medium">{{$t("message.deviceGroup.edit")}}</el-button>
				<!--删除-->
				<el-button v-if='index === 4' class="tableBtn" @click='delGroup(scope.row.id)' type="text" size="medium">{{$t("message.deviceGroup.btnDel")}}</el-button>
			</template>
		</el-table-column>
		<div slot='empty'>
			<p>{{emptyDataTip}}</p>
		</div>
	</el-table>
</template>

<script>
	$(function() {
		$('body').on('click', '.icon-checkbox-uncheck, .icon-checked', function() {
			var $this = $(this);
			if($this.attr('id') == 'checkAll') {
				$this.toggleClass('icon-checkbox-uncheck').toggleClass('icon-checked');
				let checkF = $this.hasClass('icon-checked');
				if(checkF) {
					$('.icon-checkbox-uncheck').addClass('icon-checked').removeClass('icon-checkbox-uncheck');
				} else {
					$('.icon-checked').removeClass('icon-checked').addClass('icon-checkbox-uncheck');
				}
			} else {
				$this.toggleClass('icon-checkbox-uncheck').toggleClass('icon-checked');
				let trL = $("#tree tbody").find('tr').length;
				let checked = $(".icon-checked:not('#checkAll')").length;
				if(trL == checked) {
					$("#checkAll").toggleClass('icon-checked', true).toggleClass('icon-checkbox-uncheck', false);
				} else {
					$("#checkAll").toggleClass('icon-checked', false).toggleClass('icon-checkbox-uncheck', true);
				}
			}
		})
	})
	import treeToArray from './eval'
	export default {
		name: 'treeTable',
		props: {
			data: {
				type: [Array, Object],
				required: true
			},
			columns: {
				type: Array,
				default: () => []
			},
			emptyDataTip:"",
			evalFunc: Function,
			evalArgs: Array,
			expandAll: {
				type: Boolean,
				default: false
			}
		},
		data () {
			return {
				checkAll: false,
				listLoading: false
			}
		},
		computed: {
			// 格式化数据源
			formatData: function() {
				let tmp
				if(!Array.isArray(this.data)) {
					tmp = [this.data]
				} else {
					tmp = this.data
				}
				const func = this.evalFunc || treeToArray
				const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
				return func.apply(null, args)
			}
		},
		methods: {
			showRow: function(row) {
				const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
				row.row._show = show
				return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
			},
			// 切换下级是否展开
			toggleExpanded: function(trIndex) {
				const record = this.formatData[trIndex]
				record._expanded = !record._expanded
			},
			addChildGroup(pid) {
				this.$emit('addChildGroup', pid);
			},
			addPeersGroup(pid) {
				this.$emit('addPeersGroup', pid);
			},
			// 图标显示
			iconShow(index, record) {
				return(index === 0 && record.child && record.child.length > 0)
			},
			groupSel(list) {
				let ids = [];
				list.forEach((item, index) => {
					ids.push(item.id);
					if(0 == index) {
						this.groupParentId = item.parentId;
					}
				})
				this.groupIds = ids;
			},
			transToGroup(id) {
				this.$emit('transToGroup', id);
			},
			editGroup(id, name, pId) {
				this.$emit('editGroup', id, name, pId);
			},
			delGroup(id) {
				this.$emit('delGroup', id);
			},
			renderH(h, {
				column
			}) {
				if(column.label == "No") {
					return h('span', [
						h('i', {
							attrs: {
								id: 'checkAll',
								class: 'iconfont icon-checkbox-uncheck'
							}
						}), [this.$t('message.material.No')]
					])
				} else {
					return column.label;
				}
			}
		}
	}
</script>
<style rel="stylesheet/css">
	@keyframes treeTableShow {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	
	@-webkit-keyframes treeTableShow {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	
	.iconfont {
		cursor: pointer;
	}
	
	#tree .el-table__body-wrapper {
		overflow-y:scroll;
	}
	
	#checkAll {
		padding-left: 46px;
		font-size: 18px;
	}
	.icon-checkbox-uncheck:before {
		position:relative;
		top:2px;
		content: url(../../../static/images/checkbox-no.png);
	}
	.icon-checked:before {
		position:relative;
		top:2px;
		content: url(../../../static/images/checkbox-yes.png);
	}
	.icon-checkbox-uncheck, .icon-checked {
		margin:0 0.4em;
	}
</style>

<style lang="less" rel="stylesheet/less" scoped>
	.ms-tree-space {
		position: relative;
		top: 1px;
		display: inline-block;
		font-style: normal;
		line-height: 1;
		width: 18px;
		height: 14px;
		&:before {
			content: ""
		}
	}
	
	.tableBtn {
		padding: 0;
		color: #18ABBB;
		font-size: 1em;
	}
	.processContainer {
		width: 100%;
		height: 100%;
	}
	
	.tree-ctrl {
		position: relative;
		cursor: pointer;
		color: #2196F3;
	}
	
	.showF {
		opacity: 0;
	}
	
	.el-button {
		font-size:1em;
	}
	
	.iconfont {
		font-size: 18px;
	}
	.icon-plus {
	    position: relative;
		background: url(../../../static/images/expanded.png) 50% 50% no-repeat;
	}
	.icon-minus {
	    position: relative;
		background: url(../../../static/images/expand.png) 50% 50% no-repeat;	
	}
</style>