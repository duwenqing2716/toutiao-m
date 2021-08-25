<template>
	<div class="home-container">
		<van-nav-bar class="app-nav-bar">
			<template #title>
				<van-button round type="info" class="search-btn" to="/search">
					<van-icon name="search" size="18"/>
					搜索
				</van-button>
			</template>
		</van-nav-bar>
	  <van-tabs v-model:active="active">
	    <van-tab 
			:title="channel.name" 
			v-for="channel in channels"
			:key="channel.id">
			  <tab-article :channel='channel'></tab-article>
			</van-tab>
			<template #nav-right> 
			  <van-icon name="wap-nav" @click="showPopup" class="wap-nav"/>
			</template>
	  </van-tabs>
		<van-popup
		  v-model:show="isChannelEditShow"
		  position="bottom"
		  class="channel-edit-pop"
		  closeable
		  close-icon-position="top-left"
		  get-container="body"
		  style="height: 100%">
			  <channel-edit :channels='channels' :active='active' @updateActive='updateActive' @close = 'switchChannel'/>
		</van-popup>
	</div>
</template>

<script>
	import { ref } from 'vue';
	import { mapState } from 'vuex'
	
	import TabArticle from './childComps/TabArticle.vue'
	import Search from '../search/search.vue'
	import ChannelEdit from './childComps/ChannelEdit.vue'
	
	import { getUserChannels } from 'network/home.js'
	import { getItem } from 'network/storage.js'
	
	export default {
		name: 'Home',
		data() {
			return {
				active: 0,
				channels:[]
			}
		},
		components:{
			TabArticle,
			Search,
			ChannelEdit
		},
		setup() {
		  const isChannelEditShow = ref(false);
		  const showPopup = () => {
		    isChannelEditShow.value = true;
		  };
			const active = ref(0)
		  return {
		    isChannelEditShow,
		    showPopup,
				active
		  };	
		},
		created() {
			this.loadChannels()
		},
		methods:{
			loadChannels(){
				console.log(this.user)
				if(this.user){
					console.log("登录时")
					getUserChannels().then( res => {
						this.channels = res.data.channels
					})
				}else{
					console.log("未登录时")
					const loadChannels = getItem('user-channels')
					if(loadChannels){
						console.log('有本地存储')
						this.channels = loadChannels
					}else{
						console.log('无本地存储')
						getUserChannels().then( res => {
							this.channels = res.data.channels
							console.log(res,this.channels)
						})
					}
				}
			},
			click1(){
				console.log(this.isChannelEditShow)
				this.isChannelEditShow = true
			},
			switchChannel(){
				this.isChannelEditShow = false
			},
			updateActive(index){
				this.active = index
			}
			// searchItem(){
			// 	this.$router.push('search')
			// }
		},
		computed:{
			...mapState(['user'])
		}
	}
</script>
<style scoped lang="less">
	.home-container {
   //   vue组件中，在style设置为scoped的时候，里面在写样
		 // 式对子组件是不生效的，如果想让某些样式对所以子组件
		 // 都生效，可以使用 /deep/ 深度选择器。
		/deep/ .van-nav-bar__title {
			max-width: none;
		}
		.search-btn {
			width: 277px;
			height: 32px;
			background: #5babfb;
			border: none;
			.van-icon {
				font-size: 16px;
			}
			.van-button__text {
				font-size: 14px;
			}
		}
		.wap-nav {
    position: fixed;
    right: 0;
    background-color: #fff;
    opacity: .8;
    font-size: 26px;
    line-height: 43px;
		box-shadow: 1px -4px 8px #ccc;
  }
  /deep/ .van-tabs {
		width: 96%;
    .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    .van-tabs__line {
      width: 15px !important;
      background-color: #3296fa;
      bottom: 20px;
    }
  }
  .channel-edit-popup {
    border-radius: 10px 10px 0 0;
  }
	}
</style>