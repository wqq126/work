import Vue from 'vue'
import Router from 'vue-router'
import HomeList from '@/components/newslist/newsList'
import ListDetail from '@/components/listdetail/listdetail'

Vue.use(Router)

export default new Router({
  routes: [
		{
			path:'/',
			name:'home',
			component:HomeList,
			meta:{
				keepAlvie:true,
				isBack:false
			}
		},
		{
			path:'/homedetail',
			name:'homedetail',
			component:ListDetail,
			meta:{
				keepAlvie:false,
				isBack:false,
				scroll:''
			}
		}
  ]
})
