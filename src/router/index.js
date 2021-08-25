import { createRouter, createWebHashHistory } from 'vue-router'
import { Dialog } from 'vant'
import store from '../store/'

const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('views/home/Home.vue'),
		meta: { requiresAuth: false }
		// children:[
		// 	{
		// 		path:'/article/:articleId',
		// 		name:'article',
		// 		component: () => import('views/detail/ArticleDetail.vue')
		// 	}
		// ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('views/login/Login.vue'),
		meta: { requiresAuth: false }
  },
	{
		path: '/profile',
		name: 'profile',
		component: () => import('views/profile/Profile.vue'),
		meta: { requiresAuth: false }
	},
	{
	  path: '/video',
	  name: 'video',
	  component: () => import('views/video/video.vue'),
		meta: { requiresAuth: false }
	},
	{
	  path: '/search',
	  name: 'search',
	  component: () => import('views/search/search.vue'),
		meta: { requiresAuth: false }
	},
	{
		path:'/article/:articleId',
		name:'article',
		component: () => import('views/detail/ArticleDetail.vue'),
		props:true,
		meta: { requiresAuth: true }
	},
	{
		path: '/user/profile',
		name:'user-profile',
		component: () => import('views/userEdit/userEdit.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/user/chat',
		name:'user-chat',
		component: () => import('views/UserChat/UserChat.vue'),
		meta: { requiresAuth: true }
	}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


router.beforeEach((to, from, next) => {
	// to:访问的路由页面信息,
	// from:来自哪个页面的路由信息,
	// next:放行标记
	if(to.meta.requiresAuth){
		if(store.state.user){
			return next()
		}
		Dialog.confirm({
			title:'访问提示',
			message:'该功能需要登录才能访问，确认登录吗?'
		}).then( () => {
			router.replace({
				name: 'login',
				query: {
					redirect: router.currentRoute.fullPath
				}
			})
		}).catch( () => {
			
			next(false)
		})
	}else{
		next()
	}
})

export default router
