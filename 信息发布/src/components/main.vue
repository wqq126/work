<template>
	<div id="main" class="bx">
		<header>
			<div class="header_left"><span v-if='sysBabk' @click="bakSysSel"><img src="../../static/images/sysBack.png" alt="" /><span class="sysBack" v-text='$t("message.btnBack")'></span></span>{{$t("message.systemName")}}</div>
			<div class="header_right" ondragstart="return false;">

				<el-dropdown class="user-header" @command="handleCommand">
					<img :src='user_img' alt="" class="bx el-dropdown-link">
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="editPwd">{{$t("message.changePsw")}}</el-dropdown-item>
						<el-dropdown-item v-if='!sysBabk' command="logout">{{$t("message.outLogin")}}</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>

				<div class="user-name">
					{{$t("message.hello")}} {{user_name}}
				</div>

				<!--<div class="info-centre" @click="msgCentre.dialogVisible = true">
					<el-badge :value="msgCentre.total" :max="99" class="item">
						<i class="el-icon-message"></i>
					</el-badge>
					<span>{{$t("message.mesCenter")}}</span>
				</div>-->

			</div>
		</header>
		<div class="main bx">
			<nav ondragstart="return false;">
				<div class="fill-in" style="height: 3%;"></div>
				<ul>
					<li v-for="(item,index) in items" :class="activeStutas==index?'active':''" v-if="item.showFlag">
						<router-link :to="item.path">
							<img :src="activeStutas==index?item.urlActive:item.url" :alt="item.name" srcset="">{{item.name}}
						</router-link>
						<hr class="border-bottom" />
					</li>
				</ul>
			</nav>
			<main>
				<el-row :class="{hide:uploadMaterial}" style='height:100%;'>
					<material-upload @backPrepage='backPrePage' @updateUpNum='uploadingNumC'></material-upload>
				</el-row>
				<el-row :class="{hide:!uploadMaterial}" style='height:100%;'>
					<transition name='main-fade' mode='out-in'>
						<router-view v-on:pageName='changeActiveStutas' @showUploadC='showUpload'></router-view>
					</transition>
				</el-row>
			</main>
		</div>
		<div class="mask " style="z-index: 100;background: rgba(0,0,0,0.2);position: absolute;left: 0;top: 0;width: 100%;height: 100%;display: none;">
		</div>

		<el-dialog id="msg-centre" title="消息中心" :visible.sync="msgCentre.dialogVisible" width="60%" center>
			<div class="deal-box">
				<el-button icon="el-icon-delete">清空</el-button>
				<el-button icon="el-icon-refresh">刷新</el-button>
			</div>
			<div class="msg-box">
				<ul>
					<li v-for="item in msgCentre.items">
						<div class="icon-img">
							<div class="icon-border">
								<i class="el-icon-message"></i>
							</div>
						</div>
						<div class="msg-content">
							<div class="content">
								<label>{{item.title}}</label><span>{{item.createTime}}</span><span class="status">已读</span>
								<p>发送人： {{item.username}} | {{item.content}}</p>
							</div>
						</div>
						<div class="icon-detail">
							<i class="el-icon-arrow-right"></i>
						</div>
					</li>
				</ul>
			</div>
		</el-dialog>

		<el-dialog class="change-password" :title='$t("message.changePsw")' :visible.sync="editPwd.dialogVisible" width="30%" center @close="closeEditPwd('editPwd.form')">
			<el-form :model="editPwd.form" status-icon :rules="editPwd.rules" ref="editPwd.form" label-width="200px" style="width: 80%;">
				<el-form-item class="required" :label='$t("message.oldPassword")' prop="oldPassword">
					<el-input type="password" v-model="editPwd.form.oldPassword" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item class="required" :label='$t("message.newPassword")' prop="newPassword">
					<el-input type="password" v-model="editPwd.form.newPassword" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item class="required" :label='$t("message.confirmPassword")' prop="surePassword">
					<el-input type="password" v-model="editPwd.form.surePassword" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div style="text-align: center;">
				<el-button class="mybtn-primary" type="primary" @click="submitEditPwdForm('editPwd.form')">{{$t("message.saveChange")}}</el-button>
				<el-button class="mybtn-primary" @click="editPwd.dialogVisible = false">{{$t("message.cancelChange")}}</el-button>
			</div>
		</el-dialog>
		<el-tooltip class="item" effect="dark" :content="$t('message.upGlobalTip')" placement="top">
			<el-row id='upload_state_main' v-show='uploading' @click.native='showUpload' @dblclick.native='hideStates($event)'>
				<span>{{this.$t('message.upWaiting')}}</span>{{waitingNum}}, <span>{{this.$t('message.uploading')}}</span>{{uploadingNum}}, <span>{{this.$t('message.upSuccess')}}</span>{{upSuccess}}, <span>{{this.$t('message.upFail')}}</span>{{upError}}
			</el-row>
		</el-tooltip>
	</div>
</template>

<script>
	import {
		http
	} from "../api/config";
	import CryptoJS from 'crypto-js/crypto-js';
	import materialUpload from '@/components/material/materialUpload'
	var timer = null;
	export default {
		name: 'App',
		components: {
			"material-upload": materialUpload
		},
		data() {
			var validateNewPass = (rule, value, callback) => {
				if(value !== this.editPwd.form.surePassword && this.editPwd.form.surePassword !== '') {
					callback(new Error(this.$t("message.noMatch")));
				} else {
					this.$refs['editPwd.form'].clearValidate('surePassword');
					callback();
				}
			};
			var validateSurePass = (rule, value, callback) => {
				if(value != this.editPwd.form.newPassword) {
					callback(new Error(this.$t("message.noMatch")));
				}
				this.$refs['editPwd.form'].clearValidate('newPassword');
				callback();
			};
			return {
				uploadMaterial: true,
				uploading: false,
				uploadingNum: 0,
				waitingNum:0,
				upSuccess:0,
				upError:0,
				prePage: 1,
				sysBabk:false,
				items: [{
						name: this.$t('message.menu.home'),
						path: '/home',
						url: './static/images/home.png',
						urlActive: './static/images/homeActive.png',
						showFlag: false
					},
					{
						name: this.$t('message.menu.device'),
						path: '/device',
						url: './static/images/deviceMange.png',
						urlActive: './static/images/deviceMangeActive.png',
						showFlag: false
					},
					{
						name: this.$t('message.menu.authority'),
						path: '/powerIndex',
						url: './static/images/power.png',
						urlActive: './static/images/powerActive.png',
						showFlag: false
					},
					{
						name: this.$t('message.menu.material'),
						path: '/material',
						url: './static/images/material.png',
						urlActive: './static/images/materialActive.png',
						showFlag: false
					},
					{
						name: this.$t('message.menu.release'),
						path: '/release',
						url: './static/images/releaseManage.png',
						urlActive: './static/images/releaseManageActive.png',
						showFlag: false
					},
					{
						name: this.$t('message.menu.examine'),
						path: '/examine',
						url: './static/images/examineActive.png',
						urlActive: './static/images/examine.png',
						showFlag: false
					},
					{
						name: this.$t('message.menu.systemSetup'),
						path: '/systemSet',
						url: './static/images/set.png',
						urlActive: './static/images/setActive.png',
						showFlag: false
					}
				],
				activeStutas: 0, //标识当前已被激活的组件
				user_img: './static/images/userLog.png', //用户头像
				user_name: localStorage.getItem('current_user'),
				msgCentre: {
					total: 0,
					current_page: 1,
					limit: 10,
					dialogVisible: false,
					items: []
				},
				editPwd: {
					dialogVisible: false,
					form: {
						oldPassword: '',
						newPassword: '',
						surePassword: ''
					},
					rules: {
						oldPassword: [{
							required: true,
							message: this.$t('message.noOld'),
							trigger: 'blur'
						}],
						newPassword: [{
							required: true,
							message: this.$t('message.noNew'),
							trigger: 'blur'
						}, {
//							validator: validateNewPass,
							min: 6,
							max: 12,
							message: this.$t('message.authority.user.tips.password2'),
							trigger: 'blur'
						},{
							validator: validateNewPass,
							trigger: 'blur'
						}],
						surePassword: [{
							required: true,
							message: this.$t('message.noConfirm'),
							trigger: 'blur'
						},{
//							validator: validateSurePass,
							min: 6,
							max: 12,
							message: this.$t('message.authority.user.tips.password2'),
							trigger: 'blur'
						},{
							validator:validateSurePass,
							trigger: 'blur'
						}]
					}
				}
			}
		},
		methods: {
			//返回系统选择页面
			bakSysSel() {
				window.location = unescape(localStorage.getItem('loginPage'));
			},
			showUpload(event) {
				let $this = this;
				clearTimeout(timer);
				timer = setTimeout(()=> {
					this.$router.push('/material/materialUpload');
					this.uploadMaterial = false;
					localStorage.setItem('isUploading', false);
				}, 300)
			},
			backPrePage(path) {
				this.uploadMaterial = true;
				localStorage.setItem('isUploading', true);
				if (path) {
					this.$router.push(path);
				} else {
					this.$router.go(-1);
				}
			},
			uploadingNumC(num) {
				this.waitingNum = num[0];
				this.uploadingNum = num[1];
				this.upSuccess = num[2];
				this.upError = num[3];
				this.uploading = true;
			},
			upComplete() {
				this.uploading = false;
				this.$message.success('素材上传已完成，进入素材上传页面可查看详细');
			},
			//隐藏功能
			hideStates(event) {
				clearTimeout(timer);
				this.uploading = false;
			},
			changeActiveStutas: function(data) {
				if(data == 'materialUpload') {
					this.uploadMaterial = false;
				} else {
					this.uploadMaterial = true;
				}
				//data: 组件名;
				switch(data) {
					case 'home':
						this.activeStutas = 0; //0、1、2、3.....代表当前组件items中的下标
						break;
					case 'deviceGroup':
					case 'deviceInfo':
					case 'deviceTimeT':
					case 'timeTask':
						this.activeStutas = 1;
						break;
					case 'systemSet':
						this.activeStutas = 6;
						break;
					case 'basicSetup':
						this.activeStutas = 6;
						break;
					case 'playRecord':
						this.activeStutas = 6;
						break;
					case 'workLog':
						this.activeStutas = 6;
						break;
					case 'onlineUpdate':
						this.activeStutas = 6;
						break;
						//         发布管理
					case 'releaseManage':
						this.activeStutas = 4;
						break;
					case 'templateManage':
						this.activeStutas = 4;
						break;
					case 'layoutManage':
						this.activeStutas = 4;
						break;
					case 'taskManage':
						this.activeStutas = 4;
						break;
					case 'messageManage':
						this.activeStutas = 4;
						break;
						//素材管理
					case 'material':
					case 'materialList':
					case 'mediaList':
					case 'materialUpload':
					case 'forecast':
						this.activeStutas = 3;
						break;
						//审核管理
					case 'examineManage':
						this.activeStutas = 5;
						break;
						//权限管理
					case 'roleManage':
					case 'userManage':
						this.activeStutas = 2;
						break;
				}
			},
			initMsgCentre() {
				var _this = this;
				_this.LonbonAjax({
					type: 'GET',
					url: '/api/v1/msg',
					data: {
						page: this.msgCentre.current_page,
						limit: this.msgCentre.limit
					}
				}).then((res) => {
					var data = res.data;
					//总页数
					this.msgCentre.total = data.total;
					//详细数据
					var items = data.data;
					for(var i = 0; i < items.length; i++) {
						this.msgCentre.items.push(items[i]);
					}
				}).fail((err) => {
					console.log(err);
				});
			},
			showMsgCentre() {

			},
			handleCommand(command) {
				//注销登录
				if("logout" == command) {
					this.logout();
				} else if("editPwd" == command) {
					this.editPwd.dialogVisible = true
				}
			},
			logout() {
				let warningMsg = this.$t('message.outCongirm');
				if (this.waitingNum + this.uploadingNum > 0) {
					warningMsg = this.$t('message.outContainUpConfirm');
				}
				var _this = this;
				this.$confirm(warningMsg, {
					type: 'warning'
				}).then(() => {
					_this.LonbonAjax({
						type: 'POST',
						url: '/api/v1/loginOut'
					}).then((res) => {
						_this.toLogin();
					}, (err) => {
						_this.toLogin();
					});
				});
			},
			//注销是否成功，都跳转到登录页面
			toLogin() {
				localStorage.removeItem('token');
				localStorage.removeItem('serverVersion');
				localStorage.removeItem('packVersion');
				localStorage.removeItem('current_user');
				localStorage.removeItem('userId');
				localStorage.removeItem('user_permissions');
				let loginPage = localStorage.getItem('loginPage');
				if(loginPage) {
					localStorage.removeItem('loginPage');
					window.location.href = unescape(loginPage);
				} else {
					this.$router.push('/login');
				}
			},
			submitEditPwdForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						var _this = this;
						var oldPassword = CryptoJS.HmacSHA256(_this.editPwd.form.oldPassword, _this.user_name).toString();
						var newPassword = CryptoJS.HmacSHA256(_this.editPwd.form.newPassword, _this.user_name).toString();
						_this.LonbonAjax({
							type: 'POST',
							url: '/api/v1/updatePassword',
							data: {
								oldPassword: oldPassword,
								newPassword: newPassword
							}
						}).then((res) => {
							this.$message({
								message: this.$t('message.changeSuccess'),
								type: 'success',
								duration: 1500,
								onClose: function() {
									_this.toLogin();
								}
							});
						}).fail((err) => {
							this.$message.error(err.message);
						});
					} else {
						return false;
					}
				});
			},
			//获取权限zw 0827
			getAuthority() {
				let myPermission = window.localStorage["user_permissions"];
				myPermission = JSON.parse(myPermission);
				for(var i = 0; i < this.items.length; i++) {
					//this.items[i].showFlag=true; //测试用全部菜单显示
					for(var j = 0; j < myPermission.length; j++) {
						if(this.items[i].path == myPermission[j].action) {
							this.items[i].showFlag = true;
						}
					}

				}
			},

			resetEditPwdForm(formName) {
				this.$refs[formName].resetFields();
			},
			closeEditPwd(formName) {
				this.$refs[formName].resetFields();
			}
		},
		created() {
			if (localStorage.getItem("loginPage")) {
				this.sysBabk = true;
			}
			//初始化
			this.initMsgCentre();
			this.getAuthority();
		},
		//		beforeRouteEnter(to, from, next) {
		//			//传给父组建值
		//			next(vm => {
		//				vm.uploadMaterial = false;
		//			})
		//		},
		mounted() {
			//this.msgData[1].showFlag = false;
		},
	}
</script>

<style>
	#main {
		width: 100%;
		height: 100%;
		padding-top: 4.875em;
	}
	.el-dropdown {
		font-size:1em !important;
	}
	
	.header_right {
		cursor: pointer;
		position: relative;
		float: right;
		width: 25%;
	}
	
	.user-name {
		float: right;
		margin-right: 2em;
	}
	
	.header_left img {
		width:0.7em;
		cursor:pointer;
	}
	
	.sysBack {
		position:relative;
		top:-0.25em;
		font-size: 0.6em;
		margin-right:1.5em;
		cursor:pointer;
	}
	
	.user-header {
		float: right;
		width: 4.875em;
		padding-right:1.125em;
		height: 100%;
		box-sizing:border-box;
		line-height:normal !important
		/*line-height: 12em;*/
	}
	
	.header_infoBox {
		display: none;
		width: 140px;
		height: 130px;
		background: #1985ce;
		position: absolute;
		right: 0px;
		bottom: -18px;
		border-radius: 6px;
		transform: translateY(100%);
		z-index: 100;
		padding: 0 10px
	}
	
	.header_info_li {
		width: 100%;
		height: 42px;
		border-bottom: 1px solid #fff;
		font-size: 18px;
		line-height: 42px;
	}
	
	.header_info_li:last-of-type {
		border: none;
	}
	
	.header_infoBox_mask {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 102;
	}
	
	.header_infoBox_chooseClass {
		width: 110px;
		height: 40px;
		line-height: 40px;
		position: absolute;
		left: 0;
		bottom: 0;
		z-index: 9;
		/* background: red;  */
		z-index: 103;
	}
	
	.hideDown {
		z-index: 100;
	}
	
	.header_infoBox_sign {
		width: 20px;
		height: 20px;
		background: #1985ce;
		position: absolute;
		right: 30px;
		top: 0;
		transform: translateY(-50%) rotate(45deg);
	}
	
	.border-bottom {
		width: 80%;
		height: 1px;
		border: 0;
		background: rgba(235, 238, 245, 0.31);
		/*margin-top: 0px;
    margin-bottom: 0px;*/
	}
	/**
   * 消息中心
   */
	
	.info-centre {
		float: right;
		margin-right: 2em;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.info-centre .item {
		margin-right: 1em;
		display: flex;
		float: left;
		z-index: 110;
	}
	
	.info-centre .item .el-icon-message {
		font-size: 2em;
	}
	
	.info-centre span {
		float: left;
	}
	
	#msg-centre .deal-box {
		text-align: right;
	}
	
	#msg-centre .deal-box button {
		border: none;
		color: #18ABBB;
		font-size: 1.3em;
	}
	
	#msg-centre .msg-box {
		width: 100%;
		height: 30em;
		overflow-y: auto;
	}
	
	#msg-centre .msg-box ul li {
		height: 6em;
		background-color: #F9F9F9;
		border-bottom: 1px solid #E7E9EB;
	}
	
	#msg-centre .msg-box ul li:hover {
		background-color: #E2F1F8;
		cursor: pointer;
	}
	
	#msg-centre .msg-box .icon-img {
		height: 100%;
		float: left;
	}
	
	#msg-centre .msg-box .icon-img .icon-border {
		width: 3em;
		height: 3em;
		border-radius: 50%;
		border: 2px solid #F2BD8C;
		background-color: white;
		text-align: center;
		margin: 1.5em 1em;
	}
	
	#msg-centre .msg-box .icon-img .icon-border i {
		font-size: 2em;
		color: #F2BD8C;
		line-height: 1.5em;
	}
	
	#msg-centre .msg-box .msg-content {
		width: 85%;
		height: 100%;
		float: left;
	}
	
	#msg-centre .msg-box .msg-content .content {
		margin-top: 1.5em;
	}
	
	#msg-centre .msg-box .msg-content label {
		font-weight: bold;
		margin-right: 1em;
	}
	
	#msg-centre .msg-box .msg-content p {
		margin: 0.5em 0;
		display: block;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		width: 100%;
	}
	
	#msg-centre .msg-box .msg-content span.status {
		float: right;
		color: #BEC6CB;
	}
	
	#msg-centre .msg-box .icon-detail {
		font-size: 2em;
		float: right;
		margin-top: 1em;
		margin-right: 0.5em;
	}
	
	#msg-centre .msg-box:after {
		clear: both;
		content: '';
		display: block;
	}
	
	.el-input__inner {
		height: 2.25em !important;
		line-height: 2.25em !important;
	}
	/*弹框*/
	
	.el-message-box {
		display: inline-block;
		width: 23em;
	}
	
	.el-message-box__header {
		position: relative !important;
		padding: 2em 25px 10px !important;
	}
	
	.el-message-box__btns {
		display: flex;
		flex-direction: row-reverse;
		justify-content: center;
		padding-top: 2em !important;
	}
	
	.el-message-box__btns button {
		border: none !important;
		border-radius: 0.3em !important;
		color: white !important;
		background-color: #18abbb !important;
		padding: 0 1em !important;
		margin: 0 10px !important;
		height: 1.6em !important;
		min-width: 5em !important;
		line-height: 1.8em !important;
		font-size: 0.8em !important;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1) !important;
	}
	
	.el-message-box__content {
		/*padding: 10px 25% !important;*/
		font-size: 0.875em !important;
		text-align: center;
	}
	
	.el-message-box__status,
	.el-message-box__message {
		display: inline-block;
	}
	/*输入提示靠右*/
	
	.change-password .el-form-item__error {
		color: #f56c6c;
		font-size: 12px;
		line-height: 1;
		padding-top: 4px;
		position: absolute;
		top: 100%;
		right: 0 !important;
	}
	
	#upload_state_main {
		position: absolute;
		display:inline-block;
		bottom: 2em;
		left: 8em;
		padding: 3px 30px;
		border-radius: 4px;
		background-color: #18abbb;
		color: #FFF;
		cursor: pointer;
	}
</style>