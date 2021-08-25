<template>
	<div class="comment-list">
		<!-- 文章评论列表 -->
		<van-list
		  v-model:loading="state.loading"
		   :finished="state.finished"
		  finished-text="没有更多了"
		  @load="onLoad">
		<van-cell/>
		  <comment-item v-for="(item,index) in state.list" :key="index" :comment='item' @replay-click='replayClick'></comment-item>
		</van-list>
		<!-- /文章评论列表 -->
	</div>
</template>

<script>
	import commentItem from './commentItem.vue'
	
	import { reactive,onUpdated,inject } from 'vue';
	
	import { getComments } from 'network/comment.js'
	
	export default {
		name:'commentList',
		props:{
			source:{
				type:[String,Number,Object],
				required:true
			},
			commentList:{
				type:Array,
				default(){
					return []
				}
			},
			type:{
				type:String,
				default(){
					return 'a'
				}
			}
		},
		components:{
			commentItem
		},
		data(){
			return {
				totalCommentCount:0
			}
		},
		setup(props,context){
			const state = reactive({
			  list: [],
			  loading: false,
			  finished: false,
				offset: null,
				limit: 10,
				count: 0
			});
			
			
			
			const onLoad = () => {
			  const data = getComments({
					type: props.type,
					source: props.source.toString(),
					offset: state.offset,
					limit: state.limit
				}).then(res => {
					
					const resData = res.data.results
					// console.log(res,'-----')
					state.list.push(...resData)
					
					state.count = res.data.total_count
					// console.log(state.count,'123')
					// provide('update-count',res.data.total_count)
					state.loading = false
					if(res.data.length){
						// console.log(resData.length,res.data.last_id)
						state.offset = data.last_id
					}else{
						// console.log('结束')
						state.finished = true
					}
				})
			};
			
			onUpdated ( () => {
				const emitter = inject("emitter");    // Inject `emitter`
				emitter.emit("myevent", state.count);
			})
			
			return {
			  state,
			  onLoad
			}
		},
		created(){
			
		},
		methods:{
			replayClick(comment){
				console.log(comment)
				this.$emit('replayClick',comment)
			}
		},
		computed:{
			
		}
	}
</script>

<style scoped="scoped" lang="less">
	
</style>
