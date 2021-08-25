<template>
  <div class="search-result">
    <van-list
      v-model:loading="state.loading"
       :finished="state.finished"
      finished-text="没有更多了"
      @load="onLoad">
      <van-cell v-for="(item,index) in state.list" :key="item" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { reactive } from 'vue';

import { getSearchResult } from 'network/search.js'
	
export default {
  name: 'SearchResult',
  components: {},
  props: {
		searchText:{
			type:String,
			required:true,
			default(){
				return ''
			}
		}
	},
	setup(props,context) {
	    const state = reactive({
	      list: [],
				page:1,
				per_page:10,
	      loading: false,
	      finished: false,
	    });
	
	    const onLoad = () => {
				// console.log('123')
	      getSearchResult({
					page: state.page,//页码
					per_page: state.per_page,//每页大小
					q:props.searchText
				}).then( res => {
					console.log(res)
					const dataRes = res.data.results
					state.list.push(...dataRes)
					state.loading =  false
					
					if(dataRes.length){
						state.page++
					}else{
						state.finished = true
					}
				})
	    };
	
	    return {
	      state,
	      onLoad,
	    };
	  },
  data () {
    return {
      list: [],
      finished: false,
			
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    
  }
}
</script>
<style scoped lang="less"></style>