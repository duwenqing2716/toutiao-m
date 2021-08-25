<template>
	<div class="chat-container">
		<van-nav-bar class="page-navbar" title="小智同学" left-text="取消" @click-left="$emit('cancel')" fixed/>
		<van-cell-group class="message-list" ref='message-list'>
			<van-cell v-for="(item,index) in messages" :key='index'>
				<template #title>
            <span>{{item.msg}}</span>
				</template>
			</van-cell>
		</van-cell-group>

			<van-cell-group class="send-message-wrap">
				<van-field v-model="value" center clearable :border="false" round/>
				<van-button type="primary" @click='onSend'>发送</van-button>
			</van-cell-group>
	</div>
</template>

<script>
	import {
		ref
	} from 'vue';
	
	import io from 'socket.io-client'
	
	import { setItem,getItem } from 'network/storage.js'
	
	
	
	
	
	// socket.on('disconnect',function(){
	// 	console.log('失败')
	// })
	
	
	export default {
		name: 'UserChat',
		data() {
			return {
        socket: null,
				message: '',
				messages: getItem('chat-messages') || []
			}
		},
		setup() {
			const value = ref('');
			return {
				value
			};
		},
		computed: {

		},

		watch: {
      messages(){
				setItem('chat-messages',this.messages)
				// 数据视图未更新,延迟操作
				this.$nextTick( () => {
					this.scrollToBottom()
				})
			}
		},

		created() {
			this.socket = io('http://ttapi.research.itcast.cn')
			
			this.socket = socket
			
      socket.on('connect',function(){
      	console.log('链接建立成功')
      }),
			
			socket.on('disconnect',function(){
				console.log('链接建立失败')
			})
			
			socket.on('message',function(data){
				// console.log(data)
				this.messages.push(data)
				
				this.messages=''
			})
		},

		mounted() {
       this.scrollToBottom()
		},

		methods: {
      onSend(){
				this.socket.emit('message',{
					msg: this.message,
					timestamp: Date.now()
				})
			},
			scrollToBottom(){
				const list =this.$refs['message-list']
				list.scrollTop = list.scrollHeight
			}
		}
	}
</script>

<style scoped lang="less">
	.van-cell{
		border-radius: 20px;
	}
	.chat-container {
		position: absolute;
		width: 100%;
		height: 100%;
		padding: 46px 0 50px 0;
		top: 0;
		left: 0;
		box-sizing: border-box;
		background: #f5f5f6;

		.message-list {
			height: 100%;
			overflow-y: scroll;

			.message-item {
				display: flex;
				flex-flow: row nowrap;
				align-items: flex-start;
				padding: 10px;

				.msg-wrap {
					word-break: break-all;
					word-wrap: break-word;
				}

				.title {
					display: table;
					background: #e0effb;
					border-radius: 6px;
					font-size: 14px;
					padding: 10px 10px;
					margin-right: 45px;
				}

				.avatar {
					width: 40px;
					height: 40px;
					margin-right: 5px;
				}
			}

			.reverse {
				flex-direction: row-reverse;

				.msg-wrap {
					display: flex;
					flex-direction: row-reverse;

					.title {
						margin-right: 5px;
						margin-left: 45px;
					}
				}
			}
		}

		.send-message-wrap {
			display: flex;
			align-items: center;
			padding: 14px;
			position: fixed;
			bottom: -10px;
			z-index: 9;
			left: 0;
			right: 0;
			background: #f5f5f6 !important;
			.van-button{
				width: 90px;
				height: 44px;
				margin-left: 2px;
				border-radius: 24px;
			}
		}
	}
</style>
