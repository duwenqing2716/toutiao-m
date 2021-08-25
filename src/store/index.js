// import { from } from 'core-js/fn/array'
import { createStore } from 'vuex'
import { getItem,setItem,removeItem } from '../network/storage'

const USER_KEY = 'toutiao-user'

export default createStore({
  state: {
    user:getItem(USER_KEY),
		cachePages: ['ArticleDetail']
  },
  mutations: {
    setUser(state,data){
      state.user=data
      //数据持久化
      setItem(USER_KEY,state.user)
    },
		addCachePage(state,page){
			if(!state.cachePages.includes(page)){
				state.cachePages.push(page)
			}
		},
		removeCachePage(state,page){
			const index = state.cachePages.indexOf(page)
			if(index !== -1){
				state.cachePages.splice(index,1)
			}
		}
  },
  actions: {
  },
  modules: {
  }
})
