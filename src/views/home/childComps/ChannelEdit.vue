<template>
    <div class="channel-edit">
      <van-cell >
				<template #title>
					<span :border="false">我的频道</span>
				</template>
				<template #value>
					<van-button
					  size="mini"
					  round
					  type="danger"
					  plain
						@click='clickEdit'
					>{{isEdit ? '完成' : '编辑'}}</van-button>
				</template>
      </van-cell>
      <van-grid :gutter="6">
        <van-grid-item
				  :class="{active : index === active}"
				  :icon="(isEdit && index !==0 )? 'clear' : ''"
          class="channel-item"
          v-for="(channel, index) in channels"
          :text="channel.name"
					@click='onUserChannelClick(channel,index)'
        />
      </van-grid>
      <van-cell >
				<template #title>
					<span :border="false">频道推荐</span>
				</template>
			</van-cell>
      <van-grid :gutter="6">
        <van-grid-item
				  :icon="isEdit ? 'add' : ''"
          class="channel-item"
          v-for="(channels, index) in recommendChannels"
          :key="index"
          :text="channels.name" 
					@click='onAdd(channels)'
        />	
      </van-grid>
    </div>
</template>

<script>
	import { getAllChannels,addUserChannel,deleteUserChannels } from 'network/home.js'
	
	import { mapState } from 'vuex'
	
	import { setItem } from 'network/storage.js'
	
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
		channels:{
			type:Array,
			required:true,
			default(){
				return []
			}
		},
		active:{
			type:Number,
			required:true,
			default(){
				return null
			}
		}
	},
  data () {
    return {
			allChannels:[],
			isEdit:false
		}
  },
	created() {
		this.loadAllChannels()
	},
	methods:{
		loadAllChannels(){
			getAllChannels().then( res => {
				this.allChannels = res.data.channels
				// console.log(this.allChannels,res.data.channels)
			})
		},
		clickEdit(){
			this.isEdit = !this.isEdit
		},
		onAdd(channels){
			// console.log(channels.name)
			if(this.isEdit)
			this.channels.push(channels)
			
			if(this.user){
				addUserChannel({
					channels:[
						{id: channels.id, seq: this.channels.length},
					]
				})
			}else{
				setItem('user-channels',this.channels)
			}
		},
		onUserChannelClick(channel,index){
			if(this.isEdit && index !== 0){
				this.deleteChannel(channel,index)
			}else{
				this.switchChannel(index)
			}
		},
		deleteChannel(channel,index){
			if(index<=this.active){
				this.$emit('update-active',this.active-1)
			}
		  this.channels.splice(index,1)
			
      if(this.user){
      	deleteUserChannel({
      		channels:[
      			{id: channel.id},
      		]
      	})
      }else{
      	setItem('user-channels',this.channels)
      }
		},
		switchChannel(index){
			this.$emit('update-active',index)
			this.$emit('close')
		}
	},
	computed: {
		...mapState(['user']),
		recommendChannels(){
			return this.allChannels.filter( channel =>{
				return !this.channels.find(Channel =>{
					return Channel.id == channel.id 
				})
			})
		}
	}
}
</script>

<style scoped lang="less">
.channel-edit {
	padding-top: 35px;
  .channel-item {
    height: 44px;
    /deep/ .van-grid-item__content {
      background-color: #f5f5f6;
      .van-grid-item__text {
        color: #222;
        font-size: 14px;
      }
    }
  }
	/deep/ .active{
		.van-grid-item__text{
			color: red !important;
		}
	}
	/deep/ .van-grid-item__icon{
		position: absolute;
		right: -7px;
		top: -7px;
		font-size: 16px;
		color: #999999;
		z-index: 1;
	}
}
</style>
