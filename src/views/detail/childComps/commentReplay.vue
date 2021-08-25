<template>
  <div class="page-container">
    <!-- 评论回复 -->
    <van-nav-bar class="nav-bar" :title="`${comment.reply_count}条回复`">
			<template #left>
				<van-icon name="cross" @click="$emit('close')"/>
			</template>
    </van-nav-bar>

    <comment-item :comment="comment"/>

    <van-cell title="全部评论"/>

    <!-- 回复列表 -->
    <comment-list
      :source="comment.com_id"
      :commentsList = 'commentsList'
			:type="'c'"
			@replayClick='onReplayClick'
      :total-count.sync="comment.reply_count"
    />
    <!-- /回复列表 -->

    <div class="footer">
      <van-button
        class="write-btn"
        type="default"
        round
        size="small"
				@click='onPost'
      >写评论</van-button>
    </div>
    <!-- /评论回复 -->

    <!-- 发布评论回复 -->
    <van-popup
      class="post-comment-popup"
      v-model:show="isPostShow"
      position="bottom"
    >
      <post-comment
        :target="target"
        :article-id="articleId"
				:content = 'replayName? `回复 @${replayName}: ` : ""'
        @post-success='onPostSuccess'
				:replyTo="replayName? `回复 @${replayName} : ` : `回复 @${comment.aut_name} : `"
      />
    </van-popup>
    <!-- /发布评论回复 -->
  </div>
</template>

<script>

import commentItem from './commentItem.vue'
import commentList from './commentList.vue'
import postComment from './postComment.vue'

import { ref,reactive } from 'vue'

export default {
  name: 'commentReply',
  components: {
    commentItem,
		commentList,
		postComment
  },
  props: {
    comment: {
      type: Object,
      required: true,
			default(){
				return {}
			}
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
	setup(){
		// reactive为响应式,ref不能更改所赋的值,只在setup中能有效修改且只能通过行内样式进行修改值,在
		// method方法中更改无效
		const state = reactive({
			isPostShow: false
		});
		
		const showPostPopup = () => {
		  state.isPostShow.value = true;
		}
		return {
			state,
			showPostPopup
		}
	},
  data () {
    return {
      commentsList: [],
      isPostShow: false,
      target: this.comment.com_id,
			replayName: null
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
		onPost(){
			this.isPostShow = true
		},
		onPostSuccess(comment){
			this.commentsList.unshift(comment)
			
			this.comment.replay_count++
			this.isPostShow = false
		},
		onReplayClick(comment){
      this.replayName = comment.aut_name
      this.commentsList.unshift(comment)
			this.isPostShow = true
		}
  }
}
</script>

<style scoped lang="less">
.nav-bar {
  position: fixed;
  left: 0;
  right: 0;
  top: 24%;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .write-btn {
    width: 60%;
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
