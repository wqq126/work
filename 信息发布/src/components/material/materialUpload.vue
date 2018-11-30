<template>
	<div id="uploadPage">
		<el-row class="page-title">{{this.$t('message.material.materialM')}}</el-row>
		<div class="commonBoxNavBox bx">
	    	<el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" >
	    		<el-menu-item v-for="(item, index) in materialItem" :key='index' :index='index+""' disabled v-show='item.showFlag'>
				  	<a @click.prevent='goPage(item.path)'>{{item.name}}</a>
				</el-menu-item>
	    	</el-menu>
	    </div>
			<vueWebuploader
		        ref="uploader"
		        :url="uploadUrl"
		        :accept="acceptType"
		        :formData="fileData"
		        uploadButton="#filePickerXXX"
		        multiple
		        @fileChange="fileChange"
		        @progress="onProgress"
		        @uploadstart='uploadStart'
		        @uploadBeforeSend="uploadBeforeSend"
		        @success="onSuccess"
		        @removeFile="removeFile"
		        @error='upladerError'
		        @complete='upComplete'
			>
		</vueWebuploader>
		<el-row class='containerTab'>
			<div class="operateBox item">
				<!--返回-->
				<el-button type="primary" class='el-button mybtn-primary' size="small" @click='backMaterial'>{{$t('message.material.btnBack')}}</el-button>
				
				<!--删除-->
				<el-button type="primary" class='el-button mybtn-primary' size="small" @click='delMaterial'>{{$t('message.material.btnDel')}}</el-button>
				<!--开始上传-->
				<el-button id='uploaderSubmit' class='el-button mybtn-primary' style="margin-left: 10px;" size="small" type="primary" @click="submitUpload">{{$t('message.material.uploadStart')}}</el-button>
				<div id='filePickerXXX' class='el-button mybtn-primary'>{{$t('message.material.upFile')}}</div>
			</div>
				
			<!--素材列表-->
			<el-table :data="fileList" id='materialUpTab' class="my-table" @selection-change="selsChange" highlight-current-row height="calc(100% - 90px - 2.5em)" style="width: 100%;">
				<el-table-column type="selection" width='100'></el-table-column>
				<el-table-column type="index" :label="$t('message.material.No')" width='200'></el-table-column>
				<el-table-column prop="nameC" show-overflow-tooltip :label="$t('message.material.fileName')" width='300'></el-table-column>
				<!--<el-table-column prop="location" :label="$t('message.material.location')"></el-table-column>-->
				<el-table-column prop="remark" show-overflow-tooltip :label="$t('message.material.remark')"></el-table-column>
				<el-table-column prop="state" :label="$t('message.material.status')" width='500'>
					<template slot-scope="scope">
						<label class="el-icon-upload-success" v-text='scope.row.states'></label>
						<el-progress :text-inside="true" color="#18ABBB" :stroke-width="20" v-show='scope.row.progressShow' status="success" :percentage="scope.row.percentage"></el-progress>
						<span :class='scope.row.fileState' v-if='scope.row.isFinish'></span>
					</template>
				</el-table-column>
				<el-table-column :label="$t('message.material.operate')" width='200'>
					<template slot-scope="scope">
						<el-button class="tableBtn" @click='editMedia(scope.row, scope.$index)' type="text" size="medium">{{$t('message.material.btnEdit')}}</el-button>
						<el-button class="tableBtn" @click='delFile(scope.row)' type="text" size="medium">{{$t('message.material.btnDel')}}</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-row>
		
		<!--//编辑上传文件信息-->
		<el-dialog :title="$t('message.material.editFile')" :visible.sync="fileEdit" width="30%" :close-on-click-modal='false' center>
		  <el-form :label-position="labelPosition" :rules='fileRules' ref='file' status-icon validate-on-rule-change :label-width="formLabelWidth" :model="file">
		    <el-form-item :label="$t('message.material.filename_L')" :label-width="formLabelWidth" prop='nameC' class="required">
		      <el-input v-model="file.nameC" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item :label="$t('message.material.remark_L')" :label-width="formLabelWidth">
		      <el-input v-model="file.remark" auto-complete="off"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button class="mybtn-primary" type="primary" @click="fileEditSave">{{$t('message.material.btnOk')}}</el-button>
		    <el-button class="mybtn-primary" @click="fileEdit = false">{{$t('message.material.btnCancel')}}</el-button>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
	import vue from 'vue'
	import { http } from '../../api/config.js'
	import CryptoJS from 'crypto-js'
    import vueWebuploader from "@/components/material/webUploader"
	export default {
		data() {
			return {
				materialItem: [ {
		          name: this.$t('message.material.mediaMaterial'),
		          path: "/material/materialList",
		          showFlag:true
			        },
			        {
			          name: this.$t('message.material.media'),
			          path: "/material/mediaList",
			          showFlag:true
			        },
		        ],
		        activeIndex:'0',
				uploader:true,
				options: {
		          target: '//' + window.location.host + '/api/v1/media',
		          testChunks: false,
		          headers:this.headers,
		          method:'POST',
		        },
		        labelPosition:"right",
		        formLabelWidth:"30%",
		        attrs: {
		          accept: 'image/*,video/mp4'
		        },
				total: 0,
				limit: 20,
				page: 1,
				uploadUrl: localStorage.getItem('rootUrl') + http.media,
				fileList: [],
				fileMultiple: true,
				headers: {},
				acceptType:{
					mimeTypes :"image/jpg,image/jpeg,image/png,image/bmp,image/gif,video/mp4"
				},
				showDefaultList: false,
				fileNum:0,
				fileEdit:false,
				file: {
					name:'',
					nameC:'',
					remark:'',
					ext:''
				},
				fileRules:{
					nameC:[{
						required:true,
						//'素材名称不能为空'
						message: this.$t('message.material.placeholderFileName'),
						trigger:'blur'
					}]
				},
				fileData :{
					name:'',
					remark:''
				},
				fileSel:[],
				formLabelWidth:'120px',
				fileNo:0,
				fileState:'upSuccess',
				uploading:[]
			}
		},
		components:{
			vueWebuploader
		},
		watch:{
			fileList (old, newVal) {
				this.total = newVal.length;
			}
		},
		methods: {
			/*上传*/
			submitUpload() {
				this.$refs.uploader.upload();
			},
			goPage (path) {
				this.$emit('backPrepage', path);
			},
			backMaterial() {
				this.$emit('backPrepage', null);
			},
			/*添加处理*/
			fileChange(fileList, num) {
				this.uploading = num;
				fileList.forEach((item, index) => {
					let nameT = item.name;
					let prefix = nameT.substring(0, nameT.length - 1- item.ext.length);
					item.nameC = prefix;
					item.states = this.$t('message.material.waitingUp');
					this.fileList.push(item);
				})
				this.$emit('updateUpNum', num);
			},
			editMedia(file, index) {
				this.file.ext = file.ext;
				this.file.nameC = file.nameC;
				this.file.remark = file.remark;
				this.fileEdit = true;
				this.fileNo = index;
			},
			fileEditSave () {
				let fileNo = this.fileNo;
				this.$refs['file'].validate((valid) =>{
					if (!valid) {
						return;
					} else {
						let ext = this.fileList[fileNo]['ext'];
						let fileT = this.fileList[fileNo];
						fileT.nameC = this.file.nameC;
						fileT.name = this.file.nameC + '.' +  ext;
						fileT.remark = this.file.remark;
						vue.set(this.fileList, fileNo, fileT);
						this.fileEdit = false;
						this.file.filename='';
						this.file.remark = '';
					}
				})
			},
			//选择改变
			selsChange(fileList) {
				let fileListSel = [];
				fileList.forEach((item, index) => {
					fileListSel.push(item.id);
				})
				this.fileSel = fileListSel;
			},
			uploadStart(file, num) {
				this.$emit('updateUpNum', num);
			},
			onProgress(file, percentage, num) {
				this.uploading = num;
				let percent = parseInt(percentage * 100);
				this.$emit('updateUpNum', num);
				this.fileList.forEach((item, index) => {
					if (file.id == item.id) {
						let fileT = this.fileList[index];
						fileT.progressShow = true;
						fileT.percentage = percent;
						fileT.states = this.$t('message.material.uploading');
						vue.set(this.fileList, index, fileT);
						return;
					}
				})
			},
			uploadBeforeSend (obj, data, headers) {
				this.fileList.forEach((file, index) => {
					if (data.id == file.id) {
						data.remark = file.remark;
					}
				})
			},
			upladerError(message, num) {
				this.$emit('updateUpNum', num);
				this.$message.error(message);
			},
			onSuccess(file, res, num) {
				this.uploading = num;
				this.$emit('updateUpNum', num);
				let errCode = res.errorCode;
				if(405 == errCode) {
					this.$router.push('/login');
				}
				this.fileList.forEach((item, index) => {
					if(file.id == item.id) {
						this.fileList[index].progressShow = false;
						this.fileList[index]['isFinish'] = true;
						let fileT = this.fileList[index];
						if(400 == errCode) {
							fileT.states = res.message;
							fileT.fileState = 'upFailed';
						} else {
							fileT.states = this.$t('message.material.uploadSuccess');
							fileT.fileState = 'upSuccess';
						}
						vue.set(this.fileList, index, fileT);
						return false;
					}
				})
			},
			upComplete(file, response) {
				this.$emit('upComplete', true);
			},
			delFile(row) {
				this.$confirm(this.$t('message.material.upDelConfirm') + row.name, {
					type: 'warning'
				}).then(() => {
					this.fileList.forEach((file, index) => {
						if(file.id == row.id) {
							this.$refs.uploader.removeFile(this.fileList[index], this.fileList[index].fileState);
							this.fileList.splice(index, 1);
						}
					})
				}).catch(() => {})
			},
			//批量删除
			delMaterial() {
				this.$confirm(this.$t('message.material.upDelConfirm'), {
					type: 'warning'
				}).then(() => {
					this.fileSel.forEach((fileId, index) => {
						this.fileList.forEach((file, index) => {
							if(file.id == fileId) {
								this.$refs.uploader.removeFile(this.fileList[index],  this.fileList[index].fileState);
								this.fileList.splice(index, 1);
							}
						})
					})
				}).catch(() => {})
			},
			/*移除下载*/
			removeFile (file, num) {
				this.uploading = num;
				this.$emit('updateUpNum', num);
			},
			getFileName (name) {
				let dot = name.lastIndexOf('.');
				return name.substring(0, dot);
			}
		},
		mounted: function() {
		},
		beforeRouteEnter(to, from, next) {
			//传给父组建值
			next(vm => {
				vm.$emit('update:materialName', '0');
			})
		}
	}
</script>
<style lang='less'>
	.el-menu-item.is-disabled {
		opacity:1 !important;
		cursor:pointer !important;
	}
	.el-menu-item.is-disabled:hover {
		color: #303133;
	}
	
	.containerTab {
		background-color:#FFF;
		margin:4.5em 1.875em 0;
	    border-radius: 0.5em;
		height:calc((100% - 90px) - 4.5em);
	}
	#filePickerXXX {
		div:nth-child(2) {
			width:7em !important;
			left:0 !important;
		}
		input {
			position:absolute;
		}
	}
	.webuploader-container {
		position: relative;
	}
	.webuploader-element-invisible {
		position: absolute !important;
		clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
	    clip: rect(1px,1px,1px,1px);
	}
	.webuploader-pick {
		position: relative;
		display: inline-block;
		cursor: pointer;
		color: #fff;
		text-align: center;
		border-radius: 3px;
		overflow: hidden;
		/*opacity:0;*/
	}
	.webuploader-pick-hover {
		/*background: #00a2d4;*/
	}
	.el-progress {
		display:inline-block;
		width:13em;
	}
	.webuploader-pick-disable {
		opacity: 0.6;
		pointer-events:none;
	}
	#materialUpTab {
		tr td:nth-child(1), tr th:nth-child(1), {
			padding-left:1.5em;
		}
	}
</style>
<style scoped lang='less'>
	.el-menu {
		border-radius:6px;
	}
	.el-menu-item {
		margin: 0 1.6em !important;
		padding:0;
		height:3em !important;
		line-height:3em !important;
		font-size:1.375em;
		&.is-active {
			  border-bottom: 2px solid #17acbb !important;
		}
	}
	a {
		display:inline-block;
		height:100%;
		width:100%;
		text-decoration: none;
	}
	.is-active a {
		color:#17acbb !important;
	}
	.commonBoxNavBox {
		position:relative;
	}
	.tableBtn {
		padding:0;
		padding-right:15px;
		color:#18ABBB;
		font-size:1em;
	}  
	#uploadPage {
		height: 100%;
		background-color: inherit;
		border-radius:0.5em;
		box-sizing: border-box;
	}
	
	.hide .operateBox button, .hide .operateBox {
		width:0;
		height:0 !important;
		padding:0 !important;
	}
	#upload_pagination .hide .el-pagination, .hide #filePickerXXX {
		width:0;
		height:0 !important;
	}
	.hide {
		* {
			width:0;
			height:0 !important;
			padding:0;
		}
	}
	.operateBox {
		padding:1.25em;
		.el-button, div {
			float:right;
		}
	}
	
	.operateBox:after {
		clear: both;
		content: '';
		display: block;
	}
	
	.el-input {
		width:80%;
	}
	
	.upSuccess {
		position:relative;
		top:5px;
		left:5px;
		display:inline-block;
		width:1.5em;
		height:1.5em;
		background:url(../../../static/images/success.png) 50% 50% no-repeat;
		background-size:1.5em 1.5em;
	}
	.upFailed {
		position:relative;
		top:5px;
		left:5px;
		display:inline-block;
		width:1.5em;
		height:1.5em;
		background:url(../../../static/images/delete.png) 50% 50% no-repeat;
		background-size:1.5em 1.5em;
	}
	.toolbar {
		margin-top:1em;
		padding-right:2em;
	}
</style>