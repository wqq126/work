<template>
	<div id="materialList">
			<el-row class='item operateBox'>
				<!--请输入文件名-->
				<el-input v-model.number="fileName" @keydown.enter.native.trim='searchFile' :placeholder="$t('message.material.placeholderFileName')" prefix-icon="el-icon-search"></el-input>
					<!--类型：-->
					<label for="">{{this.$t('message.material.type_L')}}</label>
					<!--请选择类型-->
					<el-select v-model="mediaTypeSel" @change='searchFileBySel' :placeholder="$t('message.material.placeholderType')">
						<el-option v-for="(value, key) in mediaType" :key='value' :label="value" :value="key"></el-option>
					</el-select>
					<!--删除-->
				<el-button type="primary" class='mybtn-primary' @click="delFile">{{this.$t('message.material.btnDel')}}</el-button>
				<!--上传文件-->
				<el-button type="primary" class='mybtn-primary' @click="uploadFile">{{this.$t('message.material.btnUpload')}}</el-button>
				<!--搜索-->
				<el-button id='search' type="primary" class='mybtn-primary' @click="searchFile">{{this.$t('message.material.btnSearch')}}</el-button>
			</el-row>
			
			<!--素材列表-->
			<el-table ref='materialTab' :data="mediaList" class="my-table" @sort-change='sortTab' @selection-change="selsChange" highlight-current-row v-loading="listLoading" height="calc(100% - 90px - 2.5em)" style="width: 100%;">
				<el-table-column type="selection"></el-table-column>
				<!--序号-->
				<el-table-column type="index" :index="indexMethod" :label="$t('message.material.No')" width='120'></el-table-column>
				<!--文件名-->
				<el-table-column prop="name" :label="$t('message.material.fileName')" show-overflow-tooltip sortable='custom' :sort-orders='tableSortType' style="width: 30%;"></el-table-column>
				<!--大小-->
				<el-table-column prop="filesize" :label="$t('message.material.size')" sortable='custom' :sort-orders='tableSortType' style="width: 10%;"></el-table-column>
				<!--类型-->
				<el-table-column prop="type" :label="$t('message.material.type')" style="width: 10%;"></el-table-column>
				<!--时长-->
				<el-table-column prop="timeLength" :label="$t('message.material.duration')" style="width: 10%;"></el-table-column>
				<!--上传时间-->
				<el-table-column prop="createTime" :label="$t('message.material.uploadTime')" sortable='custom' :sort-orders='tableSortType' style="width: 10%;"></el-table-column>
				<!--状态-->
				<el-table-column prop="state" :label="$t('message.material.status')" style="width: 10%;">
					<template slot-scope="scope">
						<span :class='{using:scope.row.isUse, unUse:!scope.row.isUse}'>{{scope.row.state}}</span>
					</template>
				</el-table-column>
				<!--操作-->
				<el-table-column :label="$t('message.material.operate')" style="width: 10%;">
					<template slot-scope="scope">
						<!--编辑-->
						<el-button class="tableBtn" @click='editMedia(scope.row)' type="text" size="medium">{{$t('message.material.btnEdit')}}</el-button>
						<el-button class="tableBtn" @click='downloadMedia(scope.row.mediaId)' type="text" size="medium">{{$t('message.material.download')}}</el-button>
						<!--删除-->
						<el-button class="tableBtn" @click='delMedia(scope.row.mediaId)' type="text" size="medium">{{$t('message.material.btnDel')}}</el-button>
					</template>
				</el-table-column>
				<div slot='empty'>
					<p>{{emptyDataTip}}</p>
				</div>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar">			
				<el-pagination background  layout="total,sizes,prev, pager, next,jumper" 
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange" 
					:page-sizes="[10,20,30, 50]" 
					:page-size="limit"  
					:current-page="page"
					:total="total" style="float:right;">
				</el-pagination>
			</el-col>
			<!--资源编辑对话框-->
			<el-dialog :title="$t('message.material.materialEdit')" :close-on-click-modal='false' @close='materialClose' center id='materialEdit' :visible.sync="materialEdit" width="50%">
				
				<el-row>
					<el-col :span=11>
						<el-form :label-position="labelPosition" :rules='fileRules' ref='file' status-icon validate-on-rule-change :label-width="formLabelWidth" :model="file">
						    <!--名称-->
						    <el-form-item class='required' :label="$t('message.material.name_L')" prop='name'>
							    <el-input v-model="file.name"></el-input>
							</el-form-item>
							<!--大小-->
							<el-form-item v-show='!file.image' :label="$t('message.material.size_L')">
							    {{file.size}}
							</el-form-item>
							<!--类型-->
							<el-form-item :label="$t('message.material.type_L')">
							    <span v-text='file.type'></span>
						  	</el-form-item>
						  	<!--时长-->
						  	<el-form-item v-show='!file.image' :label="$t('message.material.duration_L')">
							    <span v-text='file.videoTime'></span>
						  	</el-form-item>
						  	<!--上传日期-->
						  	<el-form-item :label="$t('message.material.uploadTime_L')">
							    <span v-text="file.time"></span>
							</el-form-item>
							<!--审核-->
							<el-form-item id='addrSel' :label="$t('message.material.status_L')">
								{{file.status}}
						    </el-form-item>
						    <!--审核意见-->
						    <!--<el-form-item :label="$t('message.material.examineSuggest_L')">
							    <el-input type="textarea" disabled v-model="file.exterime"></el-input>
							</el-form-item>-->
							<!--备注信息-->
						    <el-form-item id='fileRemark' :label="$t('message.material.remark_L')">
							    <el-input type="textarea" v-model="file.remark"></el-input>
							</el-form-item>
						</el-form>			
					</el-col>
					<el-col :span=13>
						<img v-if='file.image' :src='file.path' />
						<el-row v-else id='videoPre'>
							<video-player  class="video-player vjs-custom-skin"
							     ref="videoPlayer"
							     :playsinline="true"
							     :options="playerOptions"
							></video-player>
						</el-row>
					</el-col>
				</el-row>
			  <div slot="footer" class="dialog-footer">
			  	<el-button type="primary" @click="materialEditE" class='mybtn-primary'>{{this.$t('message.material.btnOk')}}</el-button>
			    <el-button type="primary" @click="materialEdit = false" class='mybtn-primary'>{{this.$t('message.material.btnCancel')}}</el-button>
			  </div>
			</el-dialog>
	</div>
</template>

<script>
	/* eslint-disable*/
	import { http } from '../../api/config'
	import Vue from 'vue'
	import VideoPlayer from 'vue-video-player'
//	import 'video.js/dist/lang/zh-CN';
	import 'video.js/dist/video-js.css'
	import 'vue-video-player/src/custom-theme.css'
	Vue.use(VideoPlayer)

	export default {
		data() {
			return {
				//文件类型
				mediaType: {},
				fileName: '',
				filterFileName:'',
				mediaTypeSel: '',
				mediaList:[],
				total: 0,
				limit: 20,
				page: 1,	
				order: 'orderTime',
				orderType:'desc',
				//选择的素材ID
				ids:[],
				//是否显示遮罩层
				listLoading:true,
				//流媒体上传弹出框
				mediaAdd:false,
				labelPosition:'right',
				formLabelWidth:'30%',
				urlInType:'',
				materialEdit: false,
				materialType:'',
				tableSortType:['ascending', 'descending'],
				file: {
					id:0,
					type:'',
					name:'',
					exterime:'',
					time:'',
					size:'',
					videooTime:'',
					remark:'',
					status:'',
					path:'',
					image:true
				},
				fileRules :{
					name:[{
						required:true,
						//'素材名称不能为空'
						message: this.$t('message.material.materialNameNotNull'),
						trigger:'submit'
					}]
				},
				playerOptions : {
			        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
			        autoplay: false, //如果true,浏览器准备好时开始回放。
			        muted: false, // 默认情况下将会消除任何音频。
			        loop: false, // 导致视频一结束就重新开始。
			        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
			        language: localStorage.getItem('current_lan'),
			        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
			        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
			        sources: [{
			          type: "",
			          src: "" //url地址
			        }],
			        poster: "../../../static/images/loginBg.png", //你的封面地址
			        // width: document.documentElement.clientWidth,
			        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
			        controlBar: {
			          timeDivider: true,
			          durationDisplay: true,
			          remainingTimeDisplay: false,
			          fullscreenToggle: true  //全屏按钮
			        }
			    },
			    emptyDataTip:"",
			    downloadURI:""
			}
		},
		computed : {
//			this.playerOptions.language = localStorage.getItem('current_lan')||'zh-CN';
		},
		methods: {
			//素材编辑事件
			materialEditE() {
				this.$refs['file'].validate((valid) =>{
					if (!valid) {
						return;
					} else {
						let data = {
							mediaId:this.file.id,
							mediaName:this.file.name,
							remark:this.file.remark
						}
						let sourceOption = {
							url:http.media+'/'+this.file.id,
							type:'PUT',
							data:data
						}
						this.LonbonAjax(sourceOption).then((res) => {
							let resCode = res.errorCode;
							if (200 == resCode) {
								//'更新成功'
								this.$message.success(this.$t('message.material.updateSuccess'));
								this.getMediaList();
								this.materialEdit = false;
							} else {
								this.$message.error(res.message);
							}
						}, (err) => {
							this.$message.error(err.message);
						})
					}
				})
			},
			indexMethod(index){				
				return (this.page - 1) * (this.limit) + 1 + index;
			},
			materialClose () {
				this.playerOptions.sources[0].src = '';
				this.file.remark = "";
			},
			sortTab (clumn) {
				this.page = 1;
				switch(clumn.prop) {
					case 'name' :
						this.order = 'orderName';
						break;
					case 'filesize':
						this.order = 'orderSize';
						break;
					default:
						this.order = 'orderTime';
						break;
				}
				this.fileName = this.filterFileName;
				if ('ascending' == clumn.order) {
					this.orderType = 'asc';
				} else {
					this.orderType = 'desc';
				}
				this.getMediaList();
			},
			getMediaList () {
				var listOption = {
					url:"/api/v1/mediaList",
					type:'GET',
					data:{
						mediaName:this.filterFileName,
						mediaType:this.mediaTypeSel,
						limit:this.limit,
						page:this.page,
						orderInfo:this.order+','+this.orderType
					}
				}
				var $this = this;
				this.listLoading = true;
				this.LonbonAjax(listOption).then((res) => {
					let dataList = res.data;
					this.mediaList = dataList.data;
					this.total = dataList.total;
					this.mediaList.forEach(function(item, index) {
						//审核状态
						if (item.isUse == 0) {
							$this.mediaList[index]['state'] = $this.$t('message.material.unUse');
						} else {
							$this.mediaList[index]['state'] = $this.$t('message.material.using');
						}
						$this.emptyDataTip = $this.$t('message.dataEmptyTip');
						$this.mediaList[index]['createTime'] = $this.timestampToTime($this.mediaList[index]['createTime']);
						$this.mediaList[index]['filesize'] = $this.byteToMB($this.mediaList[index]['filesize']);
					})
					$this.listLoading = false;
				}, (err) => {
					$this.listLoading = false;
					$this.emptyDataTip = $this.$t('message.dataEmptyTip');
					$this.mediaList = [];
					$this.total = 1;
					if (400 != err.errorCode) {
						$this.$message.error(err.message);
					} else if ($this.page > 1) {
						$this.page--;
						$this.getMediaList();
					}
				})
			},
			/*搜索*/
			searchFile() {
				this.page = 1;
				this.order = 'orderTime';
				this.orderType = 'desc';
				this.$refs.materialTab.clearSort();
				this.filterFileName = this.fileName;
				this.getMediaList();
			},
			searchFileBySel () {
				this.page = 1;
				this.order = 'orderTime';
				this.orderType = 'desc';
				this.$refs.materialTab.clearSort();
				this.filterFileName = this.fileName;
				this.getMediaList();
			},
			handleSizeChange (limit) {
				this.limit = limit;
				this.fileName = this.filterFileName;
				this.getMediaList();
			},
			handleCurrentChange (page) {
				this.mediaList = [];
				this.emptyDataTip = "";
				this.page = page;
				this.fileName = this.filterFileName;
				this.getMediaList();
			},
			/*上传*/
			uploadFile() {
				this.$router.push('/material/materialUpload');
				this.$emit('uploadFile', '1');
			},
			editMedia (data) {
				this.file.id = data.mediaId;
				let fileType = data.type;
				//判断是否是流媒体
				let materialOp = {
					url : http.media + '/' + data.mediaId,
					type:'GET'
				}
				var $this = this;
				this.LonbonAjax(materialOp).then((res) => {
					this.materialEdit = true;
					let file = res.data;
					this.file.name = file.name;
					this.file.path = localStorage.getItem('rootUrl') + file.path;
					let fileSize = (file.filesize / (1024 * 1024)).toFixed(2) + "MB";
//					this.file.size = fileSize;
					Vue.set(this.file, 'size', fileSize);
					this.file.type = fileType;
					let fileCreate = file.createTime;
					this.file.time = $this.timestampToTime(fileCreate);
					//审核意见
					this.file.exterime = file.auditOpinion;
					let fileStatus = data.isUse;
					if (0 ==fileStatus) {
						this.file.status = this.$t('message.material.unUse');
					} else {
						this.file.status = this.$t('message.material.using');
					}
					this.file.videoTime = file.timeLength;
					this.file.remark = file.remark;
					if ('image' == file.type) {
						this.file.image = true;
					} else {
						this.file.image = false;
						this.playerOptions.sources[0].src = this.file.path;
					}
				}, (err) => {
					this.$message.error(err.message);
				})
			}, 
			/*删除文件*/
			delFile() {
				if (this.ids.length < 1) {
					this.$message.warning(this.$t('message.material.selMaterialToDel'));
				} else {
					this.$confirm(this.$t('message.material.delConfirm'), {type:'warning'}).then(() => {
						let materialDel = {
							url:http.media + "/0",
							type:'DELETE',
							data:{
								mediaIds:this.ids.join(',')
							}
						}
						
						this.LonbonAjax(materialDel).then((res) => {
							let resCode = res.errorCode;
							if (resCode == 200) {
								//'删除成功'
								this.$message.success(
									this.$t('message.material.delSuccess')
								)
								this.getMediaList();
							}
						}, (err) => {
							this.$message.error(err.message);
						})
					}).catch(() => {})
				}
			},
			selsChange (list) {
				this.ids = [];
				list.forEach((item, index) => {
					this.ids.push(item.mediaId);
				})
			},
			//素材下载
			downloadMedia(id) {
				window.location.href = localStorage.getItem('rootUrl') + http.downloadMedia + id;
			},
			delMedia (id) {
				var $this = this;
				//'确认删除选中记录吗？'
				this.$confirm(this.$t('message.material.delConfirm'), {
					type: 'warning'
				}).then(() => {
					let delOption = {
						url:http.media + '/' + id,
						type:'DELETE'
					}
					this.LonbonAjax(delOption).then((res) => {
						if (res.errorCode == 200) {
							$this.$message({
								type:'success',
								//'删除成功'
								message: this.$t('message.material.delSuccess'),
								duration: 1000
							})
							this.getMediaList();
						}
					}, (err) => {
						this.$message.error(err.message);
					})
				}).catch(() => {})
			},
			backList () {
				this.uploadFlag = true;
			},
			timestampToTime (time) {
				var time = new Date(time*1000);
				var y = this.zeroBu(time.getFullYear()); //年
				var m = this.zeroBu(time.getMonth() + 1); //月
				var d = this.zeroBu(time.getDate()); //日
				var h = this.zeroBu(time.getHours()); //时
				var mm = this.zeroBu(time.getMinutes()); //分
				var s = this.zeroBu(time.getSeconds()); //秒
				var times = y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
				return times;
			},
			zeroBu (n) {
				if(n < 10) {
					return '0' + n;
				} else {
					return n
				}
			},
			byteToMB (fileSize) {
				return (fileSize / (1024 * 1024)).toFixed(2) + "MB";
			}
		},
		mounted() {
			let typeOption = {
				url: "/api/v1/mediaList",
				type: 'GET',
				data: {
					isGetType: 'yes'
				}
			}
			this.LonbonAjax(typeOption).then((res) => {
				this.mediaType = Object.assign({
					'': this.$t('message.deviceGroup.all')
				}, res.data);
			}, (err) => {
				if (400 != err.errorCode) {
					this.$message.error(err.message);
				}
			})
			this.getMediaList();
		},
		beforeRouteEnter(to, from, next) {
			//传给父组建值
			next(vm => {
				vm.$emit('update:materialName', '0')
			})
		}
	}
</script>
<style scoped lang='less'>
	.tableBtn {
		padding:0;
		color:#18ABBB;
		font-size:1em;
	} 
	#materialList {
		height: 100%;
		background-color: #FFF;
		border-radius:0.5em;
		.operateBox {
			.el-icon-search {
				line-height:2.25em;
			}
			padding:1.25em;
			.el-input {
				margin-right: 1em;
				width:13.75em;
			}
			.el-button:not(#search) {
				float:right;
			}
		}
		.btnBox {
			float: right;
		}
		.toolbar {
			margin-top:1em;
			padding-right:2em;
		}
	}
	#materialEdit {
		.el-input, .el-textarea {
			width:75%;
		}
		img {
			height:20em;
			width:100%;
		}
		#videoPre {
			height:100%;
		}
		.el-form-item {
			margin-bottom:0;
		}
		.el-form-item__content, .el-form-item__label {
			line-height:2.5em;
		}
		#videoPre {
			/*margin-top:3em;*/
		}
		#fileRemark {
			margin-top:1em;
		}
	}
	.using {
		color: #05b72b;
	}
	
	.unUse {
		color:#ff0c0c;
	}
	#downloadSource {
		/*position:absolute;*/
		/*left:-10000px;*/
	}
</style>
<style lang='less'>	
	#materialEdit .el-form-item__error {
		width:75%;
	}
</style>