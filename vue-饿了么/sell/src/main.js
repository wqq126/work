// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Mint from 'mint-ui';
import  'mint-ui/lib/style.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import store from './store'
import Api from './api/index.js'
import './assets/fonts/iconfont.css'
import $ from 'jquery'
Vue.use(ElementUI);
Vue.use(Mint);
Vue.config.productionTip = false
Vue.prototype.$api = Api; //全局挂在Api
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
