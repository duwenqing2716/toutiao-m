<template>
	<div class="article-list" ref='article-list'>
		<van-pull-refresh
		  v-model="state.isRefreshLoading"
      :success-text="state.refreshSuccessText"
      :success-duration="1500"
		  @refresh="onRefresh">
		<van-list
		  v-model:loading="state.loading"
       :finished="state.finished"
      finished-text="没有更多了"
      @load="onLoad">
			<!-- <van-cell v-for="item in state.list" :key="item" :title="item" /> -->
			  <article-item
			  v-for="(article, index) in state.articles"
			  :article='article'
			  :key="index"
			  :title="article.title"></article-item>
		</van-list>
		</van-pull-refresh>
	</div>
</template>

<script>
	import { reactive } from 'vue';
	
	import ArticleItem from './ArticleItem.vue'
	
	import { debounce } from '../../../common/debounce.js'
	
	import {
		getArticles
	} from '@/network/home.js'

	export default {
		data() {
			return {
				scrollTop: 0,
			}
		},
		props:{
			channel:{
				type:Object,
				required:true,
				default(){
					return {}
				}
			}
		},
		setup(props,context) {
		    const state = reactive({
		      articles: [],
		      loading: false,
		      finished: false,
					timestamp: null,
					isRefreshLoading:false,  //下拉刷新
					refreshSuccessText:''
		    });
		
		    const onLoad = () => {
					// console.log('------------',state.articles)
		      const data = getArticles({
		        channel_id: props.channel.id, // 频道 id
		        timestamp: state.timestamp || Date.now(), // 获取下一页数据的时间戳，Date.now() 表示获取当前最新数据
		        with_top: 1
		      }).then( res => {
						// 2. 将数据添加到当前频道的文章列表中
						// ...数组，数组的展开操作符，它会把数组元素一个一个的拿出来，传递给使用的位置
						const resData = res.data.results
						state.articles.push(...resData)
						
						 // // 3. 将 loading 设置为 false
						state.loading = false
						
						if(resData.length){
							state.timestamp = data.pre_timestamp
						}else{
							state.finished = true
						}
					})
		    };
		
		    const onRefresh = () => {
					getArticles({
					  channel_id: props.channel.id, // 频道 id
					  timestamp:Date.now(), // 获取下一页数据的时间戳，Date.now() 表示获取当前最新数据
					  with_top: 1
					}).then( res => {
						const resData = res.data.results
						
						state.articles.unshift(...resData)
						
						state.isRefreshLoading = false
						
						state.refreshSuccessText = `更新了${resData.length}条数据`
					})
				}
				
				return {
		      state,
		      onLoad,
					onRefresh
		    };
		  },
		components:{
			ArticleItem
		},
		methods: {
		},
		activated(){
			this.$refs['article-list'].scrollTop = this.scrollTop
		},
		deactivated(){
			
		},
		mounted() {
			const articleList = this.$refs['article-list']
			articleList.onscroll = debounce( () => {
				this.scrollTop = articleList.scrollTop
				// console.log('111')
			}, 50)  
		}
  }
</script>
<style scoped lang="less">
	.article-list {
		position: fixed;
		left: 0;
		right: 0;
		top: 90px;
		bottom: 50px;
		overflow-y: auto;
	}
</style>
