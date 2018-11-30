import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/home/home'
import LoginNew from '@/components/login/login-new' //重写
import Main from '@/components/main'
import SystemSet from '@/components/systemSet/systemSet'
import BasicSetup from '@/components/systemSet/basicSetup/basicSetup'
import OnlineUpdate from '@/components/systemSet/onlineUpdate/onlineUpdate'
import PlayRecord from '@/components/systemSet/playRecord/playRecord'
import WorkLog from '@/components/systemSet/workLog/workLog'
import DeviceManage from '@/components/device/deviceManage'
import deviceGroup from '@/components/device/deviceGroup'
import deviceInfo from '@/components/device/deviceInfo'
import deviceTimeT from '@/components/device/deviceTimeTask'

import powerIndex from '@/components/power/powerIndex'
import roleManage from '@/components/power/roleManage'
import userManage from '@/components/power/userManage'

import material from '@/components/material/material'
import materialList from '@/components/material/materialList'
import mediaList from '@/components/material/mediaList'
import materialUpload from '@/components/material/materialUpload'
import forecast from '@/components/material/forecast'

import ReleaseManage from '@/components/release/releaseManage'
import ReleaseTemplate from '@/components/release/templateManage'
import ReleaseLayout from '@/components/release/layoutManage'
import ReleaseTask from '@/components/release/taskManage'
import ReleaseMessage from '@/components/release/messageManage'
import LayoutDesign from '@/components/release/layoutDesign'

import ExamineManage from '@/components/examine/examineManage'
Vue.use(Router)

export default new Router({
	// mode: 'history',  zw ；‘redirect’重定向 解决点击F5刷新重定向此页
	base: '/html/',
	routes: [{
			path: '/login',
			name: 'login-new',
			component: LoginNew
		},
		{
			path: '/',
			redirect: {
				name: 'login-new'
			},
			component: LoginNew
		},
		{ // 主组件
			path: '/home',
			redirect: {
				name: 'home'
			},
			component: Main,
			children: [
				/*{
					path: '/',
					redirect: {name: 'home'},
					component: Home
				},*/
				{
					path: '/home',
					name: 'home',
					component: Home
				},
				{
					path: '/device',
					redirect: to => {
						let myPermission = window.localStorage["user_permissions"];
						myPermission = JSON.parse(myPermission);
						for (var j = 0; j < myPermission.length; j++) {
							//遍历一级菜单
							if (myPermission[j].action == '/device') {
								//console.log(myPermission[j].child[0].action);
								let firstChild = myPermission[j].child[0].action; //重定向到第一个子页面
								return {
									name: firstChild.split('/')[1]
								};
							}
						}
					},
					name: 'deviceManage',
					component: DeviceManage,
					children: [{
							path: '/device/deviceGroup',
							name: 'deviceGroup',
							component: deviceGroup
						},
						{
							path: '/device/deviceInfo',
							name: 'deviceInfo',
							component: deviceInfo
						},
						{
							path: '/device/timeTask',
							name: 'timeTask',
							component: deviceTimeT
						}
					]
				},
				{
					path: '/powerIndex',
					name: 'powerIndex',
					component: powerIndex,
					redirect: to => {
						let myPermission = window.localStorage["user_permissions"];
						myPermission = JSON.parse(myPermission);
						for (var j = 0; j < myPermission.length; j++) {
							if (myPermission[j].action == '/powerIndex') {
								let firstChild = myPermission[j].child[0].action; //重定向到第一个子页面
								return {
									name: firstChild.split('/')[1]
								};
							}

						}
					},
					children: [{
							path: '/roleManage',
							name: 'roleManage',
							component: roleManage
						},
						{
							path: '/userManage',
							name: 'userManage',
							component: userManage
						}
					]
				},
				{
					path: '/material',
					name: 'material',
					component: material,
					redirect: to => {
						let myPermission = window.localStorage["user_permissions"];
						myPermission = JSON.parse(myPermission);
						for (var j = 0; j < myPermission.length; j++) {
							//遍历一级菜单
							if (myPermission[j].action == '/material') {
								//console.log(myPermission[j].child[0].action);
								let firstChild = myPermission[j].child[0].action; //重定向到第一个子页面
								return {
									name: firstChild.split('/')[1]
								};
							}

						}
					},
					children: [{
							path: '/material/materialList',
							name: 'materialList',
							component: materialList
						},
						{
							path: '/material/mediaList',
							name: 'mediaList',
							component: mediaList
						},
						{
							path: '/material/materialUpload',
							name: 'materialUpload',
							component: forecast
						},
						{
							path: '/material/forecast',
							name: 'forecast',
							component: forecast
						}
					]
				},
				{
					path: '/release',
					name: 'ReleaseManage',
					component: ReleaseManage,
					redirect: to => {
						let myPermission = window.localStorage["user_permissions"];
						myPermission = JSON.parse(myPermission);
						for (var j = 0; j < myPermission.length; j++) {
							//遍历一级菜单
							if (myPermission[j].action == '/release') {
								//console.log(myPermission[j].child[0].action);
								let firstChild = myPermission[j].child[0].action; //重定向到第一个子页面
								console.log(firstChild.split('/')[1])
								return {
									name: firstChild.split('/')[1]+'Manage'
								};
							}

						}
					},
					children: [{
							path: '/release/template',
							name: 'templateManage',
							component: ReleaseTemplate
						},
						{
							path: '/release/layout',
							name: 'layoutManage',
							component: ReleaseLayout
						},
						{
							path: '/release/task',
							name: 'taskManage',
							component: ReleaseTask
						}, {
							path: '/release/design/:id',
							name: 'layoutManage',
							component: LayoutDesign
						}, {
							path: '/release/messageManage',
							name: 'messageManage',
							component: ReleaseMessage
						}
					]
				},
				{
					path: '/examine',
					name: 'examineManage',
					component: ExamineManage
				},
				{
					path: '/systemSet',
					name: 'systemSet',
					component: SystemSet,
					children: [{
							path: '/systemSet/',
							//redirect: {name: 'basicSetup'},
							redirect: to => {
								// 方法接收 目标路由 作为参数
								// return 重定向的 字符串路径/路径对象
								let myPermission = window.localStorage["user_permissions"];
								myPermission = JSON.parse(myPermission);
								for (var j = 0; j < myPermission.length; j++) {
									//遍历一级菜单
									if (myPermission[j].action == '/systemSet') {
										//console.log(myPermission[j].child[0].action);
										let firstChild = myPermission[j].child[0].action; //重定向到第一个子页面
										return {
											name: firstChild.split('/')[1]
										};
									}

								}
							},
							//component: BasicSetup
						},
						{
							path: '/systemSet/basicSetup',
							name: 'basicSetup',
							component: BasicSetup
						},
						{
							path: '/systemSet/playRecord',
							name: 'playRecord',
							component: PlayRecord
						},
						{
							path: '/systemSet/workLog',
							name: 'workLog',
							component: WorkLog
						},
						{
							path: '/systemSet/onlineUpdate',
							name: 'onlineUpdate',
							component: OnlineUpdate
						}
					]


				}
			]
		}
	]
})
