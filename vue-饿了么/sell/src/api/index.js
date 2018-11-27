import axios from 'axios'
//远程代理解决跨域
const API_PROXY = 'https://bird.ioliu.cn/v1/?url='
// axios配置
axios.defaults.timeout = 50000;
axios.defaults.baseURL = API_PROXY + 'http://c.m.163.com/';
// axios request 拦截器
axios.interceptors.request.use(
	config => {
		const token = localStorage.getItem('session');
		config.data = JSON.stringify(config.data);
		config.headers = {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
		if(token){
			config.params = {'token':token}
		}
		return config;
	},
	err => {
		return Promise.reject(err);
	}
)

// axios reqponse 拦截器
axios.interceptors.response.use(
	response => {
		if(response.data.errCode == 2){
			
		}
		return response
	},
	err => {
		return Promise.reject(err)
	}
)

export default {
	get: function(url, params, response) {
		return new Promise((resolve,reject) => {
			axios.get(url,{
				params:params
			}).then(response => {
				resolve(response)
			})
			.catch( err => {
				reject(err)
			})
		})
	},
	post: function(url, params, response) {
		return new Promise((resolve,reject) => {
			axios.post(url,data).then(response => {
				resolve(response)
			})
			.catch( err => {
				reject(err)
			})
		})
	},
	put: function(url, params, response) {
		return new Promise((resolve,reject) => {
			axios.put(url,data).then(response => {
				resolve(response)
			})
			.catch( err => {
				reject(err)
			})
		})
	},
	delete: function(url, params, response) {
		return new Promise((resolve,reject) => {
			axios.delete(url,data).then(response => {
				resolve(response)
			})
			.catch( err => {
				reject(err)
			})
		})
	}
}
