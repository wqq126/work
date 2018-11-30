// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './assets/lonbon_icoin/iconfont.css'
import Vue from 'vue'

import router from './router'
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n'

import 'element-ui/lib/theme-chalk/index.css';


import App from './App';
import $ from 'jquery';
import CryptoJS from 'crypto-js/crypto-js';

/*导入element-ui语言包*/
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

import '../static/ueditor/ueditor.config.js'
import '../static/ueditor/ueditor.all.js'
import '../static/ueditor/ueditor.parse.min.js'



/*---------使用语言包-----------*/
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: window.localStorage['current_lan']||'zh-CN',    // 当前语言标识
  messages: {
  	// 注册i18n实例并引入我们语言文件，将Element-UI的语言包与自己的合并
    // 使用到了es6的Object.assign()方法
    'zh-CN': Object.assign(require('./assets/common/lang/cn'), zhLocale),   // 中文语言包
    'en': Object.assign(require('./assets/common/lang/en'), enLocale)    // 英文语言包
  },
});
Vue.use(ElementUI, {
  i18n: (key,value) => i18n.t(key,value)
});
/*封装请求，挂载全局使用*/
Vue.prototype.LonbonAjax = function (param) {

  var _this = this;
  _this.default = {
    url: 'index.php',
    type: 'get',
    data: {},
    timeout: 5000,
  }
  $.extend(_this.default, param);
  var _url = _this.default.url;
  var dtd = $.Deferred();
  var header = {};

  var token = localStorage.getItem('token');
  if (token) {
      // console.log(token)
       var type = this.default.type.toLocaleUpperCase();
       var timestamp = Date.parse(new Date());
       var hashkey = type + "," + this.default.url + ",{" + timestamp + "}";
       var sha256 = CryptoJS.HmacSHA256(hashkey, token).toString();
       var word = CryptoJS.enc.Utf8.parse(sha256);
       var auth = CryptoJS.enc.Base64.stringify(word);

//  let timestamp=Math.round(new Date() / 1000);
    let Authorization=`Token token="${token}",timestamp="${timestamp}",auth="${auth}"`;
      header = {
        Authorization: Authorization
    };
  }else {
    this.$router.push('/login');
  }
  _url = localStorage.getItem('rootUrl') + _url;
  	//alert(_this.default.timeout);
  	jQuery.support.cors = true;
  $.ajax({
    url: _url,
    type: _this.default.type,
    data: _this.default.data,
    timeout: _this.default.timeout,
    headers: header,
    cache:false,
    success: function (res) {
      //alert(JSON.stringify(res))
      switch (res.errorCode) {
        case 200:
          dtd.resolve(res, _this.default.data);//成功返回
          break;
        case 400:
          dtd.reject(res);
          break;
        case 402:
          dtd.reject(res);
          _this.$message({//失败返回
            message: res.message,
            type: 'error',
            duration:1666
          });
          break;
        case 405:
        case 407: 
        	let errMsg = '';
        	if (res.errorCode == 405) {
        		 errMsg = _this.$t('message.sessionTimeout')
        	} else {
        		 errMsg = _this.$t('message.tokenTimeout')
        	}
        	localStorage.removeItem('token');
          _this.$message({//失败返回
            message: errMsg,
            type: 'error',
            duration:3000
          });
					setTimeout( ()=>{
						  let loginPage = localStorage.getItem('loginPage');
							if (loginPage) {
								localStorage.removeItem('loginPage');
								window.location.href = unescape(loginPage);
							} else {
								 _this.$router.push({
				            path: '/login'
				          });
							}
					}, 1500)
          break;
          case 406:
          dtd.reject(res);
          _this.$message({//失败返回
            message: res.message,
            type: 'error',
            duration:1666
          });
          break;
          default:
          	dtd.reject(res);
          	break;
      }
    },
    error: function (err) {
    	let errMsg = _this.$t('message.systemSet.errorText');
    	if (err.statusText == 'timeout') {
    		errMsg = _this.$t('message.sysTimeout');
    	}
      _this.$message({
        message: errMsg,
        type: 'error'
      })
    }
  });
  return dtd.promise();
}
Vue.prototype.trim=function(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
},
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: {
    App
  },
  template: '<App/>' ,
  methods:{

  },
  created() {
  	var current_lang = localStorage.getItem('current_lan');
     if(!current_lang || current_lang== 'undefined'){
     	  this.$i18n.locale = 'zh-CN';

     	  window.localStorage.setItem('current_lan', 'zh-CN');
     }
  },

})
