<template>
  <van-row class="post-comment" type="flex" align="center">
    <van-col span="20">
      <van-field
        ref="post-input"
        rows="2"
				:placeholder="replyTo"
        v-model.trim="content"
        autosize
        type="textarea"
        maxlength="50"
        show-word-limit
      />
    </van-col>
    <van-col
      class="post-btn"
      span="4"
			@click='onPost'
			:disabled ='!content'
    >发布</van-col>
  </van-row>
</template>

<script>
import { getArticleById } from 'network/comment.js'

export default {
  name: 'postComment',
  components: {},
  props: {
    target: {
      type: [Number, Object, String],
      required: true
    },
    articleId: {
      type: [Number, Object, String],
      default: null
    },
    replyTo: {
      type: [Number, Object, String],
      default: '发一友善的评论吧！'
    },
		content :{
			type: [Number, Object, String],
			default: ''
		}
  },
  data () {
  },
  computed: {
    // inputPlaceholder () {
    //   const replyTo = this.replyTo
    //   return replyTo ? `回复 ${replyTo.aut_name}` : '优质评论将会被优先展示'
    // }
  },
  watch: {
  },
  created () {},
  methods: {
    onPost(){
			getArticleById({
				target: this.target,
				content: this.content,
				art_id: this.articleId ? this.articleId.toString() : null
			}).then(res => {
				// console.log(this.content)
				const resData = res.data
				this.$emit('post-success',resData)
				
				Toast.success('发布成功')
				
				this.content=''
			})
		}
  }
}
</script>

<style scoped>
.post-comment {
  padding: 12px;
}

.van-cell {
  background-color: #f5f7f9;
}

.post-btn {
  font-size: 15px;
  text-align: center;
}
</style>

