<template>
  <div class="main-background" v-loading="loadingFlag">
		<div class="left-img fl">
        <img id="login-img" src="../../../static/images/loginBg.png" alt=""/>
    </div>
    <div class="right-info fl">
    	<div class="lang-div">
    		<el-select v-model="value" :placeholder='$t("message.login.select")' @change='selectLang($event)' style="float: right; margin-right: 1em;">
			    <el-option
			      v-for="item in options"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
    		<label style="float: right;line-height: 2em;">{{$t("message.login.selectLang")}}</label>
    		
    	</div>
    	
	    	<el-form :model="userInfo" :rules="rules2" ref="userInfo" label-position="left" label-width="0px" class="demo-ruleForm login-container">
		    <h3 class="title welcom">Welcome!</h3>
		    <h3 class="title soft-name">{{$t("message.login.welocme")}}</h3>
		    <el-form-item prop="account" class="test-input"> 
		      <el-input class="test-input" type="text" v-model="userInfo.account" auto-complete="off" :placeholder='$t("message.login.userName")'>
		      	<i slot="prefix" class="iconfont icon-yonghu"></i>      
		      </el-input>
		    </el-form-item>
		    <el-form-item prop="checkPass">
		      <el-input type="password" v-model="userInfo.checkPass" auto-complete="off" :placeholder='$t("message.login.passWord")' @keyup.enter.native="login">
		      	<i slot="prefix" class="iconfont icon-mima"></i>  
		      </el-input>
		    </el-form-item>
		    <el-checkbox v-model="checked" checked class="remember">{{$t("message.login.remember")}}</el-checkbox>
		    <el-form-item style="width:100%;">
		      <el-button type="primary" class="loginBtn" style="width:100%; margin-top: 1em;"  @click.native.prevent="login" :loading="logining">{{$t("message.login.loginBtn")}}</el-button>
		    </el-form-item>
	  </el-form>
    </div>
	</div>
</template>

<script>
	import "../../assets/lonbon_icoin/iconfont.css"
  import {http} from "../../api/config"; 
  

  import CryptoJS from 'crypto-js/crypto-js';
   
  export default {
    name: 'login-new',
    data() {
      return {
        logining: false,
        loadingFlag:false,
        userInfo: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: this.$t("message.login.noName"), trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: this.$t("message.login.noPsw"), trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: false,
        options: [{
          value: 'zh-CN',
          label: '简体中文'
        }, {
          value: 'en',
          label: 'English'
        }],
        value: ''
        
      }
    },
    methods: {
      login() {
        var _this = this;
        this.logining = true;
        var username = _this.userInfo.account;
        var pwd = CryptoJS.HmacSHA256(_this.userInfo.checkPass, _this.userInfo.account).toString();
        
        _this.LonbonAjax({
        	url:http.login,        	
        	type:'POST',
        	data:{
        	username:username,
        	password:pwd,
        	version: "12345678"
        	}
        }).then(function(res) {
        	if(res.errorCode==200){        		
        		_this.logining = false;
	        	localStorage.setItem('token', res.data.token);
	        	localStorage.setItem('serverVersion', res.data.version);
	        	localStorage.setItem('packVersion', res.data.packVersion);
	        	localStorage.setItem('codeVersion', res.data.codeVersion);
	        	localStorage.setItem('current_user', _this.userInfo.account);
	        	localStorage.setItem('userId', res.data.userId);
	        	localStorage.removeItem('loginPage');
	        	if(_this.checked){
	        		let userInfo={
	        			  userName: _this.userInfo.account,
	        			  psw: _this.userInfo.checkPass
	        		};
	        		localStorage.setItem('userInfo', JSON.stringify(userInfo));	        		
	        	}else{
	        		 localStorage.removeItem('userInfo');
	        	}
	        	_this.getPermissions(res.data.userId);//获取权限
        	}
        }, function(err) {
        	_this.$message.error(err.message);
        	_this.logining = false;
        })
      },
      //获取用户权限菜单
      getPermissions(user_id) {       	
      	var _this = this;
        _this.LonbonAjax({    	 
          type: 'GET',
          url: '/api/v1/userPermissions', 
          data:{
          	userId: user_id
          }
        }).then((res) => { //成功            	              
						 if(res.errorCode==200){
						 	  localStorage.setItem('user_permissions', JSON.stringify(res.data));
						 	  let permissionObj = res.data;
						 	  for(var i = 0; i < permissionObj.length; i++) {									
										if('/home' == permissionObj[i].code) {
												_this.$router.push('/home');  //如果有首页跳转到首页
										}												
								}						 	  
						 	  _this.$router.push(permissionObj[0].code);  //跳转到第一个路由
						 	  						 	  						 	 
						 }
        }).fail((err) => { //失败              
           
        });
      },
      //检查是否记住密码
       checkRemPsw(){
	      	let PersonalData = localStorage.getItem('userInfo');
	        if (PersonalData) {
	          this.checked = true;
	          PersonalData = JSON.parse(PersonalData);
	          this.userInfo.account = PersonalData.userName;
	          this.userInfo.checkPass = PersonalData.psw;
	        } else {
	        	this.userInfo.account = '';
	          this.userInfo.checkPass = '';
	          this.checked = false;          
	        }
	      },
	      getUserInfoByToken() {
	      	this.LonbonAjax({    	 
              type: 'GET',
              url: http.loginInfo, 
              data:{
              	token: localStorage.getItem('token')
              }
            }).then((res) => { //成功            	              
							 if(res.errorCode==200){
							 	 	localStorage.setItem('serverVersion', res.data.version);
	        				localStorage.setItem('current_user', res.data.username);
	        				localStorage.setItem('packVersion', res.data.packVersion);
	        				localStorage.setItem('userId', res.data.userId);
	        				localStorage.setItem('codeVersion', res.data.codeVersion);
	        				this.getPermissions(res.data.userId);//获取权限
							 }
            }).fail((err) => { //失败 
            	 this.loadingFlag = false;
            	 let loginPage = localStorage.getItem('loginPage');
								if (loginPage) {
									localStorage.removeItem('loginPage');
									window.location.href = unescape(loginPage);
								}
               this.$message.error(err.message);
            });
	      },
      selectLang (lang) {
    		window.localStorage.setItem('current_lan', lang);
    		this.$i18n.locale = lang;
    		//解决切换语言，验证结果为改变
    		this.$refs.userInfo.resetFields();
    		if(lang == 'en'){   					    	
		    	this.rules2.account[0].message = 'Enter one user name';  
		    	this.rules2.checkPass[0].message = 'Please input a password';
    		}else{
    			this.rules2.account[0].message = '请输入用户名';  
		    	this.rules2.checkPass[0].message = '请输入密码';
    		}
    		
    	},
    	getQueryString(name) {
		    let locationUrl = window.location.href;
				let queryStrIndex = locationUrl.indexOf('?');		
				let queryStr = locationUrl.substring(queryStrIndex + 1, locationUrl.length);
				let queryArr = queryStr.split('&');
				let value = '';
				queryArr.forEach((item, index) => {
					let queryObj = item.split('=');
					if (queryObj[0] == name) {
						value = queryObj[1];
					}
				})
				return value;
			}
    },
    created() {
	    let tokenUrl = this.getQueryString('token');
	    this.value=window.localStorage['current_lan'];//默认选择语言
	    this.checkRemPsw();
			//判断是否是从统一登录入口登录的
			if (tokenUrl) {
				this.loadingFlag = true;
				localStorage.setItem('token', tokenUrl);
				localStorage.setItem('loginPage', this.getQueryString('url'));
				this.getUserInfoByToken();
			} else {
				let token = localStorage.getItem('token');
				if (token) {
					 this.$router.push('/home');
				}
			}
    },
    beforeRouteEnter(to, from, next) {
      //传给父组建值
      next(vm => {
        vm.$emit('pageName', to.name)
      })

    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	
 .main-background {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.left-img{
	width: 70%;
	height: 100%;
	float: left;
}
.left-img img{
	width: 100%;
	height: 100%;
	
}
.right-info{
	width: 30%;
	height: 100%;
	float: right;
	background: #fff;
	    padding-top: 1em;
}
.login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 10em auto;
    width: 60%;
    padding: 35px 35px 15px 35px;
    background: #fff;
    /*border: 1px solid #eaeaea;*/
    /*box-shadow: 0 0 25px #cac6c6;*/
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
       margin: 0px 0px 35px 0px;
    }
    .remember .el-checkbox__inner::after {    
       border: 2px solid #005daa !important;
    }
  }
  .test-input {
  	background: url(../../../static/images/password.png) no-repeat left 10px center !important;
  }
  .lang-div{
  	height: 3em;
  	width: 100%;
  }
  .loginBtn{
  	    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1) !important;
  	    background: #005daa;
  	    font-size: 1.25em;
  }
  .welcom{
  	color: #2aa4e8;
  	font-size: 2em;
  }
  .soft-name{
  	color: #005daa;
  	font-size: 2em;
  }
 
</style>
