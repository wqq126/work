<template>
	<div id="materialList">
		<el-row class='item operateBox'>
			<!--请输入文件名-->
			<el-input v-model="fileName" @keydown.enter.native.trim='searchFile' :placeholder="$t('message.material.placeholderFileName')" prefix-icon="el-icon-search"></el-input>
			<!--删除-->
			<el-button type="primary" class='mybtn-primary' @click="delFile">{{this.$t('message.material.btnDel')}}</el-button>
			<!--流媒体-->
			<el-button type="primary" class='mybtn-primary' @click="liveAdd">{{this.$t('message.material.btnMedia')}}</el-button>
			<!--搜索-->
			<el-button id='search' type="primary" class='mybtn-primary' @click="searchFile">{{this.$t('message.material.btnSearch')}}</el-button>
		</el-row>
		<!--素材列表-->
		<el-table :data="mediaList" ref='mediaTab' class="my-table" @sort-change='sortTab'  @selection-change="selsChange" highlight-current-row v-loading="listLoading" height="calc(100% - 90px - 2.5em)" style="width: 100%;">
			<el-table-column type="selection"></el-table-column>
			<!--序号-->
			<el-table-column type="index" :index="indexMethod" :label="$t('message.material.No')" width='80'></el-table-column>
			<!--文件名-->
			<el-table-column prop="name" sortable='custom' :sort-orders='tableSortType' show-overflow-tooltip :label="$t('message.material.fileName')" style="width: 30%;"></el-table-column>
			<!--大小-->
			<el-table-column prop="filesize" sortable='custom' :sort-orders='tableSortType' :label="$t('message.material.size')"  style="width: 10%;"></el-table-column>
			<!--类型-->
			<el-table-column prop="type" :label="$t('message.material.type')" style="width: 10%;"></el-table-column>
			<!--时长-->
			<el-table-column prop="timeLength" :label="$t('message.material.duration')" style="width: 10%;"></el-table-column>
			<!--上传时间-->
			<el-table-column prop="createTime" sortable='custom' :sort-orders='tableSortType' :label="$t('message.material.uploadTime')" style="width: 10%;"></el-table-column>
			<!--状态-->
			<el-table-column :label="$t('message.material.status')" style="width: 6%;">
				<template slot-scope="scope">
					<span :class='{using:scope.row.isUse, unUse:!scope.row.isUse}'>{{scope.row.state}}</span>
				</template>
			</el-table-column>
			<!--操作-->
			<el-table-column :label="$t('message.material.operate')" width='260'>
				<template slot-scope="scope">
					<!--编辑-->
					<el-button class="tableBtn" @click='editMedia(scope.row)' type="text" size="medium">{{$t('message.material.btnEdit')}}</el-button>
					<!--预览-->
					<el-button class="tableBtn" @click='previewMedia(scope.row)' type="text" size="medium">{{$t('message.material.btnPreview')}}</el-button>
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
		
		<!--//流媒体上传-->
		<el-dialog :title="mediaBoxTitle" @close='mediaClose' :close-on-click-modal='false' @open='mediaOpen' center id='mediaAdd' :visible.sync="mediaAdd" width="40%">
			
			<el-form :label-position="labelPosition" ref='media' :rules='mediaRules' status-icon validate-on-rule-change :label-width="formLabelWidth" :model="media">
			   <!--流媒体名称-->
			   <el-form-item :label="$t('message.material.mediaName_L')" class="required" prop='name'>
				    <el-input v-model="media.name"></el-input>
				</el-form-item>
				<!--地址输入方式-->
				<el-form-item :label="$t('message.material.addressImportType_L')">
				    <el-radio-group id='addressSelT' v-model="media.urlInType" @change='urlChange' prop='urlInType'>
				    	<!--地址列表-->
				      	<el-radio label="0">{{this.$t('message.material.addressList')}}</el-radio>
				      	<!--手动输入-->
				      	<el-radio label="1">{{this.$t('message.material.importByHand')}}</el-radio>
			    	</el-radio-group>
			  	</el-form-item>
			  	<!--流媒体地址-->
			  	<el-form-item v-if='media.urlList' :label="$t('message.material.mediaAddress_L')" class="required" prop='mediaAdress'>
				    <el-input v-model="media.mediaAdress"></el-input>
				</el-form-item>
				<!--地址列表-->
				<el-form-item id='addrSel' v-else :label="$t('message.material.addressList_L')" class="required" prop='mediaAdressSel'>
					<!--请选择流媒体地址-->
					<el-select v-model="media.mediaAdressSel" :filterable='true' @change='addressListC' size='medium' :placeholder="$t('message.material.placeholderMediaList')">
				      <el-option v-for="(value, key) in mediaAddrListSim" :key='key' :label="value" :value="key"></el-option>
				    </el-select>
			    </el-form-item>
			    <!--备注-->
			    <el-form-item :label="$t('message.material.remark_L')">
				    <el-input type="textarea" v-model="media.remark"></el-input>
				</el-form-item>
			</el-form>			
		  <div slot="footer" class="dialog-footer">
		  	<!--确 定-->
		  	<el-button type="primary" @click="mediaAddE" class='mybtn-primary'>{{$t('message.material.btnOk')}}</el-button>
		  	<!--取 消-->
		    <el-button type="primary" @click="mediaAdd = false" class='mybtn-primary'>{{$t('message.material.btnCancel')}}</el-button>
		  </div>
		</el-dialog>
		
		
		<!--//流媒体预览-->
		<el-dialog :title="$t('message.material.btnPreview')" :close-on-click-modal='false' @close='disposeVideo' center :visible.sync="mediaPreview" width="40%">
			<el-row>
				<video-player  class="video-player vjs-custom-skin"
					     ref="videoPlayer"
					     :playsinline="true"
					     :options="playerOptions"
					     @error='videoErr'
				></video-player>
			</el-row>
				
		  <div slot="footer" class="dialog-footer">
		  	<!--确 定-->
		  	<el-button type="primary" @click="endPreview" class='mybtn-primary'>{{$t('message.material.btnOk')}}</el-button>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
	/* eslint-disable*/
	import { http } from '../../api/config'
	import Vue from 'vue'
	import videoPlayer from 'vue-video-player'
//	import 'video.js/dist/lang/zh-CN';
	import 'video.js/dist/video-js.css'
	import 'vue-video-player/src/custom-theme.css'
	import 'videojs-flash'  
//	import 'videojs-contrib-hls'
	Vue.use(videoPlayer)
	export default {
		data() {
			let liveAdressV = (rule, value, callback) => {
				//地址写入方式
				if ('0' == this.media.urlInType) {
					callback();
				} else{
					if (value === '') {
						//请输入流媒体地址
			            callback(new Error(this.$t('message.material.materialNotNull')));
			       } else {
			       		callback();
			       }
				}
		      };
		      let AdressListV = (rule, value, callback) => {
				//地址写入方式
				if ('1' == this.media.urlInType) {
					callback();
				} else {
					if (value === '') {
						//请选择流媒体地址
			            callback(new Error(this.$t('message.material.materialNotSel')));
			       } else {
			       		callback();
			       }
				}
		      };
			return {
				//文件类型
				mediaType: {},
				fileName: '',
				filterFileName:'',
				mediaTypeSel: '',
				mediaList:[],
				//流媒体地址列表
				mediaAddrList:[],
				mediaAddrListSim:[],
				//流媒体类型
				addressInfo: {
					name:'',
					address:'',
					fromType:'',
					fromId:'',
					videoTime:"",
					fileSize:0
				},
				total: 0,
				limit: 20,
				page: 1,	
				order: 'orderTime',
				orderType:'desc',
				tableSortType:['ascending', 'descending'],
				//当前选中的流媒体
				ids:[],
				//是否显示遮罩层
				listLoading:true,
				//流媒体上传弹出框
				mediaBoxTitle:'流媒体上传',
				mediaAdd:false,
				labelPosition:'right',
				formLabelWidth:'30%',
				urlInType:'',
				//流媒体信息
				media: {
					id: 0,
					name:'',
					urlInType:'0',
					mediaAdress:'',
					//下拉列表选择的地址
					mediaAdressSel:'',
					urlList:false,
					remark:''
				},
				//流媒体验证信息
				mediaRules : {
					name:[{
						required:true,
						//'请输入流媒体名称'
						message: this.$t('message.material.nameNotNull'),
						trigger:'blur'
					}],
					mediaAdress:[{
						validator:liveAdressV,
						trigger:'blur'
					}],
					mediaAdressSel:[{
						validator:AdressListV,
						trigger:'submit'
					}]
				},
				materialEdit: false,
				materialType:'',
				mediaPreview:false,
				playerOptions : {
			        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
			        autoplay: true, //如果true,浏览器准备好时开始回放。
			        muted: false, // 默认情况下将会消除任何音频。
			        loop: false, // 导致视频一结束就重新开始。
			        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
			        language: localStorage.getItem('current_lan'),
			        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
			        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
			        techOrder: ['html5', 'flash'],
			        sources: [{
			          type: "",
			          src: "" //url地址
			        }, {
			            withCredentials: false,
			            type: 'application/x-mpegURL',
			            src:''
			          }
			        ],
			        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
			        controlBar: {
                       timeDivider: false,
                       durationDisplay: false,
                       remainingTimeDisplay: false,
                       fullscreenToggle: true, //全屏按钮
                       progressControl:true 
                    }
			    },
			    emptyDataTip:""
			}
		},
		methods: {
			indexMethod(index){				
				return (this.page - 1) * (this.limit) + 1 + index;
			},
			getMediaList (sortParam, sortType) {
				var listOption = {
					url:http.media,
					type:'GET',
					data:{
						mediaName:this.filterFileName,
						mediaType:'live',
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
						$this.mediaList[index]['createTime'] = $this.timestampToTime($this.mediaList[index]['createTime']);
						$this.mediaList[index]['filesize'] = $this.byteToMB($this.mediaList[index]['filesize']);
					})
					this.listLoading = false;
					this.emptyDataTip = this.$t('message.dataEmptyTip');
				}, (err) => {
					this.emptyDataTip = this.$t('message.dataEmptyTip');
					$this.listLoading = false;
					$this.mediaList = [];
					$this.total = 1;
					if (400 != err.errorCode) {
						$this.$message.error(err.message);
					} else if ($this.page > 1) {
						$this.page -= 1;
						$this.getMediaList();
					}
				})
			},
			/*搜索*/
			searchFile() {
				this.page = 1;
				this.order = 'orderTime';
				this.orderType = 'desc';
				this.$refs.mediaTab.clearSort();
				this.filterFileName = this.fileName;
				this.getMediaList();
			},
			handleSizeChange (limit) {
				this.fileName = this.filterFileName;
				this.limit = limit;
				this.getMediaList();
			},
			handleCurrentChange (page) {
				this.mediaList = [];
				this.emptyDataTip = "";
				this.fileName = this.filterFileName;
				this.page = page;
				this.getMediaList();
			},
			sortTab (clumn) {
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
			mediaOpen () {
				//流媒体打开的事件，初始化
				this.media.urlInType = '0';
				$("#addressSelT label:eq(0)").click();
				this.media.remark = '';
				this.media.mediaAdress = '';
				//流媒体地址列表是否为空
				this.media.name = "";
				this.media.urlList = false;
				this.media.mediaAdressSel = '';
				//表单是否已经生成
				if (this.$refs['media']) {
					this.$refs['media'].resetFields();
				}
			},
			/*直播预览*/
			previewMedia (row) {
				let mediaId = row.mediaId;
				let urlOption = {
					url:http.getMediaUrl + mediaId,
					type:"GET"
				}
				this.LonbonAjax(urlOption).then((res) => {
					let mediaUrl = res.data.url||row.path;
					let path = mediaUrl;
					//地址输入错误的情况
					if (mediaUrl.includes('http://')) {
						let addrSuffix = mediaUrl.substring(mediaUrl.lastIndexOf('.'), mediaUrl.length);
						let videoType = ".mp4.flv.f4v.webm.avi.wmv.rmvb";
						if (!videoType.includes(addrSuffix)) {
							this.$message.error(this.$t('message.material.mediaAddressError'));
							return;
						}
					}
				    this.playerOptions.sources[0].src = mediaUrl;
				    this.mediaPreview = true;
				}, (err) => {
					
				})
			},
			//销毁视频
			disposeVideo() {
				this.$refs.videoPlayer.player.pause();
				this.playerOptions.sources[0].src = '';
				this.playerOptions.sources[0].type = '';
			},
			endPreview () {
				this.mediaPreview = false;
			},
			videoErr (err) {
				console.error(err);
			},
			mediaClose () {
				this.media.id = 0;
			},
			/*流媒体上传*/
			liveAdd () {
				this.mediaAdd = true;
				this.mediaBoxTitle = this.$t('message.material.mediaAdd');
			},
			editMedia (data) {
				this.media.id = data.mediaId;
				let fileType = data.type;
				this.mediaAdd = true;
				this.mediaBoxTitle = this.$t('message.material.mediaEdit');
				this.media.name = data.name;
				
				let mediaOp = {
					url : http.media + '/' + data.mediaId,
					type:'GET'
				}
				this.LonbonAjax(mediaOp).then((res) => {
					let file = res.data;
					let addrIndex = 0, addrList = false;
					for (let addr in this.mediaAddrListSim) {
						if (this.mediaAddrListSim[addr] == file.originalFilename) {
							addrList = true;
							addrIndex = addr;
							break;
						}
					}
					this.media.name = file.name;
					this.media.remark = file.remark;
					//地址选择方式是否是地址列表
					if (addrList) {
						$("#addressSelT label:eq(0)").click();
						this.media.mediaAdress = '';
						this.media.mediaAdressSel = parseInt(addrIndex);
					} else {
						$("#addressSelT label:eq(1)").click();
						this.media.mediaAdress = file.path;
					}
				}, (err) => {
					this.$message.error(err.message);
				})
			}, 
			mediaAddE() {
				this.$refs['media'].validate((valid) => {
					if (!valid) {
						return;
					}
					let videoFlag = false;
					if ('0' == this.media.urlInType && this.mediaAddrList.length > 0) {
						let addrSel = this.media.mediaAdressSel;
						let addrInfo = this.mediaAddrList[addrSel]
						this.addressInfo.address = addrInfo.rtsp;
						this.addressInfo.fromId = addrInfo.sourceId?addrInfo.sourceId:addrInfo.playlistId;
						this.addressInfo.fromType = addrInfo.type;
						this.addressInfo.name = addrInfo.name;
						if (addrInfo.playlistId) {
							videoFlag = true;
							this.addressInfo.videoTime = addrInfo.timeLength;
							this.addressInfo.fileSize = addrInfo.filesize;
						}
					}
					
					let liveAddress = this.addressInfo.address||this.media.mediaAdress;
					let mediaData = {
						liveName: this.media.name,
						mediaName: this.media.name,
						addressName: this.addressInfo.name||liveAddress,
						liveAddress: liveAddress,
						remark: this.media.remark,
						isAudit: 1
					}
					if (this.addressInfo.fromId) {
						mediaData.fromId = this.addressInfo.fromId;
					}
					if (this.addressInfo.fromType) {
						mediaData.type = this.addressInfo.fromType;
					}
					if (videoFlag) {
						mediaData.timeLength = this.addressInfo.videoTime;
						mediaData['filesize'] = this.addressInfo.fileSize;
					}
					let url = http.mediaAdd;
					let ajaxType = 'POST';
					//添加成功
					var message = this.$t('message.material.addSuccess');
					if (this.media.id != 0) {
						ajaxType = 'PUT';
						//更新成功
						message = this.$t('message.material.updateSuccess');
						url = http.media + '/' + this.media.id;
					}
					let mediaAddOp = {
						url:url,
						type:ajaxType,
						data:mediaData
					}
					this.LonbonAjax(mediaAddOp).then((res) => {
						if (res.errorCode == 200) {
							this.$message.success(message);
							this.mediaAdd = false;
							this.getMediaList();
						} else {
							this.$message.error(res.message);
						}
					}, (err) => {
						this.$message.error(err.message);
					})
				}, (err) => {
					this.$message.error(err.message);
				})
			},
			/*删除文件*/
			delFile() {
				if (this.ids.length < 1) {
					this.$message.warning(this.$t('message.material.selMediaToDel'));
				} else {
					this.$confirm(this.$t('message.material.delMediaConfirm'), {type:'warning'}).then(() => {
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
								this.$message({
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
				}
			},
			urlChange (val) {
				if (val == '0') {
					this.media.urlList = false;
					this.$refs['media'].clearValidate('mediaAdress');
				} else {
					this.media.urlList = true;
					this.addressInfo.name = '';
					this.addressInfo.address = '';
					this.addressInfo.fromId = '';
					this.addressInfo.fromType = '';
					this.addressInfo.videoTime = "";
					this.addressInfo.fileSize = 0;
					this.$refs['media'].clearValidate('mediaAdressSel');
				}
				
			},
			//table选择项改变
			selsChange (list) {
				this.ids = [];
				list.forEach((item, index) => {
					this.ids.push(item.mediaId);
				})
			},
			addressListC(val) {
				let addrInfo = this.mediaAddrList[val];
				this.addressInfo.address = addrInfo.rtsp;
				this.addressInfo.name = addrInfo.name;
				this.media.name = addrInfo.name;
				this.$refs['media'].clearValidate('name');
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
			
			let mediaLiveOption = {
				url:http.mediaAddrList,
				type:'GET'
			}
			
			this.LonbonAjax(mediaLiveOption).then((res) => {
				if (res.data) {
					this.mediaAddrList = res.data.channels;
					this.mediaAddrList.forEach((address, index) => {
						this.mediaAddrListSim[index] = address.name;
					})
				}
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
				vm.$emit('update:materialName', '1')
			})
		}
	}
</script>
<style lang='less'>
	#mediaAdd {
		.el-input, .el-textarea, .el-form-item__error, .el-select{
			width:80%;
		}
		.el-select .el-input {
			width:100%;
		}
		.el-radio__inner::after {
		   background-color:#18ABBB !important;
		   width:9px !important;
		   height:9px !important;
		}
		.el-radio__inner {
			border:2px solid #18ABBB !important;
			width:20px !important;
			height:20px !important;
		}
		.el-radio__input.is-checked .el-radio__inner {
			border-color:#18ABBB !important;
			background:#FFF !important;
			width:20px !important;
			height:20px !important;
		}
	}
	
	.vjs-seeking .vjs-loading-spinner {
		display:none !important;
	}
	.el-select .el-input__inner {
		text-overflow: ellipsis;
	}
</style>
<style scoped lang='less'>
	.tableBtn {
		padding:0;
		color:#18ABBB;
		font-size:1em;
	} 
	#materialList {
		height: 100%;
		background-color: #FFF;
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
	.using {
		color: #05b72b;
	}
	
	.unUse {
		color:#ff0c0c;
	}
</style>