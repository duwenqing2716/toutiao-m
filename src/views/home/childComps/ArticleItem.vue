<template>
	<van-cell class="article-item" :to="{
		name:'article',
		params:{
			articleId: article.art_id
		}
	}">
		<template #title class="title van-multi-ellipsis--l3">{{article.title}}</template>
		<template #label>
			<div class="label-wrap">
				<div class="cover-wrap" 
				v-if="article.cover.type === 3">
					<div class="cover-warp-item"
					v-for="(img,index) in article.cover.images"
					:key='index'>
						<van-image fit="cover" 
						class="cover-image"
						:src="img"></van-image>
					</div>
				</div>
				<div class="label-wrap">
				  <span>{{ article.aut_name }}</span>
				  <span>{{ article.comm_count }}评论</span>
				  <span>{{ countDays }}</span>
				</div>
			</div>
			
		</template>
		<template #value>
		  <van-image 
			v-if="article.cover.type === 1" 
			class="right-cover" fit="cover" 
			:src="article.cover.images[0]"></van-image>
	  </template>
	</van-cell>
</template>

<script>
	import dayjs from 'dayjs'
	
	export default{
		name:'ArticleItem',
		data(){
			return{
				
			}
		},
		props:{
			article:{
				type:Object,
				required:true,
				default(){
					return {}
				}
			}
		},
		computed:{
			// Vue3.X filters移除,因此使用computed代替
		   countDays(){
		     const value = this.article.pubdate
		     return dayjs().from(dayjs(value))
		   }
		}
	}
</script>

<style scoped="scoped" lang="less">
	.article-item {
		/deep/ .van-image__img {
			width: 114px;
			height: 73px;
			padding-left: 2px;
		}
	  .title {
	    font-size: 16px;
	    color: #3a3a3a;
	  }
	  /deep/ .van-cell__value {
	    flex: unset;
	    width: 116px;
	    height: 73px;
	    margin-left: 12px;
	  }
	  .right-cover {
	    width: 116px;
	    height: 73px;
	  }
	  .cover-wrap {
	    // width: 370px;
			display: flex;
	    padding: 15px 0;
	    .cover-wrap-item {
	      flex: 1;
	      height: 73px;
	      .cover-image {
	        width: 100%;	
	        height: 73px;
	      }
	    }
	  }
	  .label-wrap {
	    font-size: 11px;
	    color: #b4b4b4;
	  }
	  .label-wrap span {
	    margin-right: 12px;
	  }
	}
</style>
