<template>
  <div class="myarticle-container page-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
			title="黑马头条"
      left-arrow
      fixed
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->
		<div class="article-wrap">
    <!-- 文章标签列表 -->
		<div class="article-title">
			<span>{{article.title}}</span>
		</div>
		<van-cell class="user-info" center :border="false">
			<template #title center>
				<div class="user-left">
					<van-image
					  class="avatar"
					  slot="icon"
					  round
					  fit="cover"
					  :src="article.aut_photo"/>
				</div>
				<div class="user-right">
					<div class="user-name">{{ article.aut_name }}</div>
					<div class="publish-date">{{ countDays }}</div>
				</div>
			</template>
			<template #value>
				<van-button
				  class="follow-btn"
				  :type="article.is_followed ? '' : 'info' "
				  color="#3296fa"
				  round
				  size="small"
					:loading="isFollowLoading"
				  :icon="article.is_followed ? '' : 'plus' "
					@click='onFollow'>{{ article.is_followed ? '已关注' : '关注' }}</van-button>
			</template>
		</van-cell>
    <!-- <van-tabs
      class="fixed-tabs"
      title-active-color="#3c9bfa"
      color="#399afa"
    >
      <van-tab>
      </van-tab>
    </van-tabs> -->
    <!-- /文章标签列表 -->
			<div class="markdown-body" v-html="article.content" ref='articles'></div>
			
			<comment-list :source='articleId' :commentList='commentList' @replayClick='onReplayClick'></comment-list> 
		</div>
  </div>
	<div class="article-bottom">
		<article-footer :article='article' :articleId='articleId' @showPopup='showPopup'></article-footer>
	</div>
	
	<van-popup v-model:show="show" position="bottom" :style="{ height: '30%' }">
		<post-comment :target="articleId" @post-success='onpostSuccess'></post-comment>
	</van-popup>
	
	<van-popup v-model:show="ReplayShow" position="bottom" :style="{ height: '70%' }">
		<comment-reply v-if="ReplayShow" :comment="replayComment" @close='ReplayShow = false' :articleId='articleId'></comment-reply>
	</van-popup>

</template>

<script>
	import 'assets/css/github-markdown.css'
	import dayjs from 'dayjs'
	import { ImagePreview } from 'vant'
	import { Toast } from 'vant'
	
	import { ref,onUpdated,nextTick,provide,reactive } from 'vue'
	import { mapState } from 'vuex'
	import articleFooter from './childComps/articleFooter.vue'
	import commentList from './childComps/commentList.vue'
	import postComment from './childComps/postComment.vue'
	import commentReply from './childComps/commentReplay.vue'
	
	import { getArticleById,addFollow,deleteFollow } from 'network/detail.js'
	
export default {
  name: 'ArticleDetail',
  components: {
		articleFooter,
		commentList,
		postComment,
		commentReply
  },
	data(){
		return{
			article:{},
			isFollowLoading:false,
			isPostShow:false,
			commentList:[],
			replayComment:{}
		}
	},
  props: {
    articleId: {
      type: [String,Number,Object],
			required: true
    }
  },
	setup(){
		const show = ref(false);
		const ReplayShow = ref(false);
		
		const showPopup = () => {
		  show.value = true;
	  };
		
		const showReplay = () => {
			// console.log('23123123')
		  ReplayShow.value = true;
		};
		
		// const ref2 = reactive({
		//       comment: {}
		//     })
		
		// const update = (val) => {
		//       ref2.comment val
		// }
		
		// provide('changeComments',{ref2,update})
		
		let articles = ref(null)
		
		// 挂着渲染时未渲染图片地址，因此Updated循环更新视图再获取图片地址进行DOM操作
		onUpdated ( () => {
			  // 获取所有imgs
				const imgs = articles.value.querySelectorAll('img')
				// 存储图片地址
				const allimages = []
				// console.log(imgs)
				// 遍历获取图片地址并加入点击事件
				imgs.forEach( (img,index) => {
					allimages.push(img.src)
					// console.log(allimages)
					img.onclick = function(){
						ImagePreview({
							images: allimages,
							startPosition: index//从第一张图片开始加载
						})
					}
				})
			// console.log(articles.value)
		})
		
		return {
			articles,
			show,
			showPopup,
			ReplayShow,
			showReplay
		}
	},
  watch: {},
  created () {
		this.loadArticle()
	},
  mounted () {
		
		// this.$store.commit('addCachePage', ArticleDetail)
	},
  methods: {
    loadArticle(){
			getArticleById(this.articleId).then( res => {
				this.article = res.data
				// console.log(this.article)
			})
		},
		async onFollow(){
			
			if(this.user){
				this.isFollowLoading = true
				// 当用户为登录状态
				console.log('用户为登录状态')
			
				if(this.article.is_followed){
					await this.$dialog.confirm({
					  message: '确定取消关注?'
					}).then(() => {
					  // 确认执行这里
					deleteFollow(this.article.aut_id)
					  // 清除容器和本地存储的数据
					}).catch(() => {
					  // 取消执行这里
					})
				}else{
					addFollow(this.article.aut_id)
					Toast({
						message : '关注成功',
						position: "center"
					})
				}
				this.article.is_followed = !this.article.is_followed
				this.isFollowLoading = false
			}else{
				// 当用户为未登录状态
				console.log('用户为未登录状态')
				Toast({
					message : '请登录后再进行操作',
					position: "center"
				})
				return
			}
		},
		onpostSuccess(comment){
			Toast.loading({
				message:'发布中',
				forbidClick:false
			})
			
			this.commentList.unshift(comment)
			this.isPostShow = false
		},
		onReplayClick(comment){
			console.log(comment,'----------')
			this.replayComment = comment
			
			this.ReplayShow = true
		}
  },
	computed:{
		countDays(){
		  const value = this.article.pubdate
		  return dayjs().from(dayjs(value))
		},
		...mapState(['user'])
	}
}
</script>

<style scoped lang="less">
	.article-wrap{
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 49px;
		overflow-y: auto;
	}
	
	.van-cell__title{
		display: flex;
	}
	.article-title{
		width: 100%;
		margin-top:46px ;
		font-size: 20px;
		height: 50px;
		background-color: white;
		span{
			padding:0 22px;
		}
	}
	.user-info {
				.user-left{
					float: left;
					padding-left: 5px;
				}
				.user-right{
					float: right;
					padding:3px 36px 0 0;
				}
	      .avatar {
	        width: 50px;
	        height: 50px;
	      }
	      .user-name {
	
	        font-size: 14px;
	
	        color: #3a3a3a;
	
	      }
	
	      .publish-date {
	
	        font-size: 12px;
	
	        color: #b7b7b7;
	
	      }
	
	      .follow-btn {
	        width: 80px;
	        height: 34px;
	
	      }
	
	    }
			
</style>
