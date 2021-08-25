<template>
  <van-cell class="comment-item">
		<template #title>
			<van-image
			  slot="icon"
			  round
			  width="30"
			  height="30"
			  style="margin-right: 10px;"
			  :src="comment.aut_photo"
			/>
			<span style="color: #466b9d;">{{ comment.aut_name }}</span>
		</template>
    <template #label>
			<p style="color: #363636;">{{ comment.content }}</p>
			<p>
			  <span style="margin-right: 10px;">{{ countDays }}</span>
			  <van-button
			    size="mini"
			    type="default"
					@click="$emit('replay-click',comment)"
			  >回复 {{ comment.reply_count }}</van-button>
			</p>
		</template>
		<template #right-icon>
			<div class="like-container" @click='onCommentLike'>
			  <van-icon
			    :color="comment.is_liking ? '#e5645f' : ''"
			    :name="comment.is_liking ? 'good-job' : 'good-job-o'"
			  />
			  <span>{{ comment.like_count ? comment.like_count : '赞' }}</span>
			</div>
		</template>
  </van-cell>
</template>

<script>
	import dayjs from 'dayjs'
	
	import { deleteCommentLike,addCommentLike } from 'network/comment.js'
	
	import { inject,provide } from 'vue'
	
export default {
  name: 'commentItem',
  components: {},
  props: {
    comment: {
      type: Object,
      required: true,
			default(){
				return {}
			}
    },
    // reply: {
    //   type: Boolean,
    //   default: true
    // }
  },
  data () {
    return {}
  },
	setup(props,context){
		// const ref2 = inject('ref2')
		
		// const onReplay = () => {
		// 	const ref2 = props.comment
		// 	ref2.changeComments(ref2)
		// }
		// return {
		// 	ref2,
		// 	onReplay
		// }
	},
  computed: {
		countDays(){
		  const value = this.comment.pubdate
		  return dayjs().from(dayjs(value))
		}
	},
  watch: {
  },
  created () {},
  methods: {
    onCommentLike(){
			const commentId = this.comment.com_id.toString()
			if(this.comment.is_liking){
				deleteCommentLike(commentId)
				this.comment.like_count--
			}else{
				addCommentLike(commentId)
				this.comment.like_count++
			}
			
			this.comment.is_liking = !this.comment.is_liking
		}
  }
}
</script>

<style scoped>
.comment-item {
  display: flex;
  align-items: flex-start;
}

.like-container {
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}
</style>
