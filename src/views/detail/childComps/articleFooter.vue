<template>
  <div class="footer">
    <van-button
      class="write-btn"
      round
      size="small"
			@click='onPopup'
    >写评论</van-button>
    <van-icon
      class="comment-icon"
			:badge="state.count"
      name="comment-o"
    />
    <van-icon
		:color="article.is_collected ? 'orange' : '#777'"
		:name="article.is_collected ? 'star' : 'star-o'"
		@click='onCollect'
		:loading='isCollectLoading'
    />
    <van-icon
		:color="article.attitude === 1 ? 'pink': '#777' "
		:name="article.attitude === 1 ? 'good-job' : 'good-job-o' "
		@click='onAttitude'
    />
    <van-icon 
		class="share-icon" 
		name="share" />
  </div>
</template>

<script>
	import { deleteCollect,addCollect,deleteLike,addLike } from 'network/detail.js'
	
	import { Toast } from 'vant'
	
	import { mapState } from 'vuex'
	import { ref,inject,reactive } from "vue";
	
	export default {
		name: 'articleFooter',
		props: {
		  article: {
				type:Object,
				required:true,
				default(){
					return {}
				}
			},
			articleId: {
			  type: [String,Number,Object],
				required: true
			}
		},
		data () {
		  return {
				isCollectLoading: false
			}
		},
		setup() {
			const state = reactive({
				count: 0
			});
			
			// const show = ref(false);
			// const showPopup = () => {
			//   show.value = true;
			// };

		  const emitter = inject("emitter");   // Inject `emitter`
		  emitter.on("myevent", (value) => {   // *Listen* for event
		      state.count = value
					// console.log(value,'------',counts)
		  });
			
				
		  return {
		    state
				
		  }
		    
		},
		methods: {
			onCollect(){
					if(this.user){
						//当用户为登录状态
						console.log('用户为登录状态')
						Toast.loading({
						  message: '加载中...',
						  forbidClick: true
						})
						
						this.isCollectLoading = true //不是button好像无用
						
						if(this.article.is_collected){
							deleteCollect(this.articleId)
						}else{
							addCollect(this.articleId)
						}
						Toast.success({
							message : `${this.article.is_collected ? '' : '取消'}收藏成功`,
							position: "center"
						})
						this.article.is_collected = !this.article.is_collected
						this.isCollectLoading = false
					}else{
						//当用户为未登录状态
						console.log('用户为未登录状态')
						Toast({
							message : '请登录后再进行操作',
							position: "center"
						})
					}
				},
				onAttitude(){
					if(this.user){
						//当用户为登录状态
						console.log('用户为登录状态')
						Toast.loading({
						  message: '加载中...',
						  forbidClick: true
						})
						
						// this.isCollectLoading = true //不是button好像无用
						
						if(this.article.attitude === 1){
							deleteLike(this.articleId)
							this.article.attitude = -1
						}else{
							addLike(this.articleId)
							this.article.attitude = 1 
						}
						// this.isCollectLoading = false
					}else{
						//当用户为未登录状态
						console.log('用户为未登录状态')
						Toast({
							message : '请登录后再进行操作',
							position: "center"
						})
					}
				},
				onPopup(){
					this.$emit('showPopup')
				}
		},
		computed:{
			...mapState(['user'])
		}
	}
</script>

<style scoped lang="less">
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 49px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
	z-index: 9;
	.van-button{
		border-radius: 8px;
		border: 1px solid #333333;
	}
  .write-btn {
    width: 160px;
  }
  .van-icon {
    font-size: 20px;
  }
  .comment-icon {
    bottom: -2px;
  }
  .share-icon {
    bottom: -2px;
  }
}
</style>

