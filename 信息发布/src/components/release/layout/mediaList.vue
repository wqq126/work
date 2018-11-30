<template>
	<el-dialog @open="init" :show-close='false' :close-on-click-modal='false' :title="$t('message.releaseManage.RegionalTime')"
	 :visible.sync="media_lsit_dialog" width="713px" center>
		<div class="layout-body">
			<draggable v-model="update_list" @update="datadragEnd" :options="{animation:500}">
				<transition-group class="drag-box">
					<div v-for="(element,index) in update_list" :key="index" class="drag-item bx">
						<el-row :gutter="24" class="operationbox" :class="element.type">
							<el-col :span="12">
								<img :src=" element.type | imgsrc" alt="">
								<span>{{element.type}}</span>
							</el-col>
							<el-col :span="12" class="action">
								<img  @click="edit(element,index)" src="../../../../static/images/whitemit.png" alt="">
								<span @click="edit(element,index)">{{$t('message.releaseManage.edit')}}</span>
								<img @click="dele(element,index)" src="../../../../static/images/whitedele.png" alt="">
								<span @click="dele(element,index)">{{$t('message.releaseManage.delete')}}</span>
							</el-col>
						</el-row>
						<div class="operationobj bx">
							<span>{{element.mediaName}}</span>
							<span>({{element.duration}}seconds)</span>
						</div>
					</div>
				</transition-group>
			</draggable>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button class="el-button mybtn-primary el-button--primary" @click='save' type="primary">{{$t('message.releaseManage.okBtn')}}</el-button>
			<el-button class="el-button mybtn-primary el-button--primary" @click="close_region">{{$t('message.cancelChange')}}</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import {
		http
	} from "../../../api/config";
	import draggable from 'vuedraggable'
	export default {
		name: "media-list",
		components: {
			draggable
		},
		props: {
			media_lsit_dialog: {
				type: Boolean,
				require: true
			},
			media_lsit_edit: {
				type: Array,
				require: true
			},
			layoutId: {
				type: String,
				require: true,
			},
			regionId: {
				type: String,
				require: true
			}
		},
		filters: {
			imgsrc: function(type) {
				var imgsrc = '';
				switch (type) {
					case 'image':
						imgsrc = require('../../../../static/images/tupian.png');
						break;
					case 'video':
						imgsrc = require('../../../../static/images/shipin.png');
						break;
					case 'live':
						imgsrc = require('../../../../static/images/shipin.png');
						break;
					case 'text':
						imgsrc = require('../../../../static/images/wenben.png');
						break;
					case 'webpage':
						imgsrc = require('../../../../static/images/webpageedit.png');
						break;
				}
				return imgsrc;
			}
		},
		data: function() {
			return {
				msg: "这是测试组件",
				update_list: []
			}
		},
		mounted() {
			//为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
			document.body.ondrop = function(event) {
				event.preventDefault();
				event.stopPropagation();
			}
		},
		methods: {
			//编辑素材
			edit: function(item, index) {
				console.log(index)
				console.log(item)
				this.$emit('media_edit', item, index);
			},
			//删除素材
			dele: function(item, index) {
				var _this = this;
				var name = item.mediaName;
				this.text = this.$t('message.releaseManage.delete_sure') + name + '?';
				this.$confirm(this.text, this.$t('message.releaseManage.tip'), {
					title: ' ',
					type: 'warning',
					closeOnClickModal: false
				}).then(() => {
					_this.LonbonAjax({
						url: http.layoutMedias + '/' + _this.regionId,
						type: 'DELETE',
						data: {
							layoutId: _this.layoutId,
							mediaId: item.mediaId,
							lkId: item.lkId,
							type: item.type
						}
					}).then(function(res) {
						_this.update_list.splice(index, 1);
						_this.$emit('dele_media_success')
					}, function(res) {
						console.log(res)
					})					
				}).catch(() => {
					// this.$message({
					//   type: 'info',
					//   message: this.$t('message.releaseManage.deleted_deleted')
					// });
				});
			},
			init: function() {
				console.log(this.media_lsit_edit)
				this.update_list = this.media_lsit_edit;
			},
			getdata(evt) {
				console.log(evt.draggedContext.element.text)
			},
			datadragEnd(evt) {
				evt.preventDefault();
				console.log('拖动前的索引 :' + evt.oldIndex)
				console.log('拖动后的索引 :' + evt.newIndex)
				console.log(this.update_list);

			},
			close_region: function() {
				this.$emit('close_region', '')
			},
			save: function() {
				var _this = this;
				var mediaList = '';
				_this.update_list.forEach((item, index) => {
					var lkid = item.lkId;
					var mediaId = item.mediaId;
					mediaList = mediaList + mediaId + ',' + lkid + '|';
				});
				_this.LonbonAjax({
					url: http.layoutMediasOrder + '/' + _this.regionId,
					type: 'POST',
					data: {
						layoutId: _this.layoutId,
						mediaList: mediaList
					}
				}).then(function(res) {
					_this.$emit('save_media_sort');
				}, function(res) {
					console.log(res)
				});

			}
		}
	}
</script>

<style scoped lang="less">
	.layout-body {
		margin: 0;
		padding: 0;
	}

	.layout-body {
		height: 500px;
		overflow-y: scroll;
		overflow-x: hidden;
	}

	.drag-item {
		width: 100%;
		height: 112px;
		margin: auto;
		position: relative;
		margin-top: 20px;

		.live {
			background: #454cd1;
		}

		.video {
			background: #454cd1;
		}

		.image {
			background: #2c6adb;
		}

		.text {
			background: #2caada;
		}

		.webpage {
			background: #2ac293;
		}

		img {
			width: 24px;
			height: 24px;
			position: relative;
			top: 5px;
			cursor: pointer;
		}

		span {
			cursor: pointer;
		}

		.operationbox {
			color: white;
			padding: 0 20px;
			height: 34px;
			line-height: 34px;
		}

		.action {
			text-align: right;
		}

		.operationobj {
			padding-left: 20px;
			height: 80px;
			background: #eeecfe;
			padding-top: 10px;
		}
	}

	.ghostClass {
		opacity: 1;
	}

	.bottom {
		width: 200px;
		height: 50px;
		position: relative;
		background: blue;
		top: 2px;
		left: 2px;
		transition: all .5s linear;
	}
</style>
<style lang="less">
	.drag-item {}
</style>
