import axios from 'axios'
import jsonBig from 'json-bigint'
import { Toast } from 'vant'

import router from '../router/'

import store from '../store/'

export function request(config) {
	
	const refreshTokenReq = axios.create({
		baseURL: 'https://toutiao.m.lipengzhou.com/api',
	})
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'https://toutiao.m.lipengzhou.com/api',
    // timeout: 5000
		transformResponse : [function (data) {
		  try {
		    return jsonBig.parse(data)
		  } catch (err) {
				console.log('失败',err)
		    return data
		  }
		}]
  })

  // 2.axios的拦截器
  // 2.1.请求拦截的作用
  instance.interceptors.request.use(config => {
		const { user } =store.state
		
		if(user) {
			config.headers.Authorization = `Bearer ${user.token}`
		}else{
			console.log('未登录')
		}
		return config
  }, err => {
    // console.log(err);
		return Promise.reject(error)
  })

  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
		
		const status = err.response.status
		
		if(status === 400){//客户端参数错误
			Toast.fail('客户端参数异常')
		}else if(status === 401){//token无效
			const user = store.state.user
			
			if(!user || !user.token){
				return redirectLogin()
			}
			// 如果有refresh_token，则请求获取新的 token
			try{
				const res = refreshTokenReq({
					method:'PUT',
					url: '/app/v1_0/authorizations',
					headers:{
						Authorization: `Bearer ${user.refresh_token}`
					}
				})
				
				// 如果获取成功，则把新的 token 更新到容器中
				user.token = res.data.data.token
				
				store.commit('setUser',user)
				
				// 把之前失败的用户请求继续发出去
				// config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
				// return 把 request 的请求结果继续返回给发请求的具体位置
				
				return request(err.config)
				
			}catch(err){
				return redirectLogin()
			}
			
		}else if(status === 403){//无权限操作
			Toast.fail('用户无权限操作')
		}else if(status >= 500){//服务端异常
			Toast.fail('服务端无资源异常')
		}
    console.log(err);
		return Promise.reject(err)
  })

  // 3.发送真正的网络请求
  return instance(config)
}

function redirectLogin(){
	router.replace({
		name: 'login',
		query: {
			// router.currentRoute和this.$route是一个东西
			
			redirect: router.currentRoute.fullPath
		}
	})
}