<template>
  <div class="search-suggestion">
    <van-cell icon="search" :key='index' v-for="(item,index) in suggestions" @click='Search(item)'>
			<template #title> 
			  <span v-html="highlight(item)"></span>
			</template>
		</van-cell>
  </div>
</template>

<script>
	import { getSearchSuggestions } from 'network/search.js'
  
  import { debounce } from '../../../common/debounce.js'
	
export default {
  name: 'SearchSuggestion',
  data () {
    return {
			suggestions:[]
		}
  },
	props:{
		searchText:{
			type:String,
			required:true,
			default(){
				return ''
			}
		}
	},
	methods:{
		highlight(str){
			const reg = new RegExp(this.searchText,'gim')
			return str.replaceAll(reg,`<span style='color:red'>${this.searchText}</span>`)
		},
		Search(value){
			// console.log(value,'1111')
			
			// $emit发射函数后父元素不能@search='search(value)'接参,可能value会重名被覆盖,
			// 因此直接正确写法:@search='search' 在methods中接参
			this.$emit('search',value)
		}
	},
	watch:{
		//要监视的属性名
		// 完整写法
		searchText:{
			// 有误:
			// handler:debounce(getSearchSuggestions(this.searchText).then( res => {
			// 		this.suggestions = res.data.options
			// 		console.log('111')
			// 	}),100),
		 //  immediate:true
		 
		 handler:debounce(async function(){
			 const { data } =await getSearchSuggestions(this.searchText)
			 this.suggestions = data.options
			 // console.log('111')
		 },400),
		 immediate:true
		}
	}
}

</script>


<style scoped lang="less"></style>