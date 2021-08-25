<template>
	<div class="search-container">
        <form action="/">
          <van-search
            v-model="value"
            show-action
            placeholder="请输入搜索关键词"
            background="#3296fa"
            @search="onSearch(value)"
            @cancel="onCancel(value)"
						@focus='isResultShow = false'
          />
        </form>
				<search-result v-if="isResultShow" :search-text='value'></search-result>
				<search-suggestion v-else-if="value" :search-text='value' @search="onSearch"></search-suggestion>
				<search-history v-else :search='searchHistories' @search='onSearch'></search-history>
	</div>
</template>

<script>
	import { ref,computed } from 'vue';
	
	import { setItem,getItem } from 'network/storage.js'
	import { getSearchHistroies } from 'network/search.js'
	
	import SearchSuggestion from './childComps/SearchSuggestion.vue'
	import SearchHistory from './childComps/SearchHistory.vue'
	import SearchResult from './childComps/SearchResult.vue'
	
	export default {
		name:'search',
		components:{
			SearchSuggestion,
			SearchHistory,
			SearchResult
		},
		setup(props,context) {
			const isResultShow = ref(false)
			const searchHis = getItem('search-histories')
			const searchHistories = ref( searchHis? (searchHis._value || searchHis) : [] )
		  const value = ref('');
			const onSearch = (val) =>{
				isResultShow.value = true
				value.value = val
				// console.log(searchHistories)
				const index = searchHistories.value.indexOf(val)
				if(index !== -1){
					searchHistories.value.splice(index,1)
				} 
				searchHistories.value.unshift(val)
				// provide("searchHistories", searchHistories); 
				// console.log(searchHistories)
				setItem('search-histories',searchHistories)
			};
			
		  return { 
				isResultShow,
				searchHistories,
				value,
				onSearch
			};
		},
		methods:{
			onCancel(value){
				// console.log(value)
				if(value){
					console.log(value)
			  }else{
					this.$router.back()
					this.value = ''
				}
			}
		},
		computed:{
			
		}
	}
</script>

<style scoped>
  .search-container {
  
    .van-search__action {
  
      color: #fff;
  
    }
  
  }
</style>
