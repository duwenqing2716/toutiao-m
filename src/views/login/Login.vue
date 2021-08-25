<template>
	<div class="login-container">
		<van-nav-bar title="登录/注册" class="app-nav-bar" left-arrow @click-left="$router.back()" />
		<van-form
		  ref='login-form'
		 :show-error='false'
		 :show-error-message ='false'
		>
			<van-field v-model="user.mobile" icon-prefix="toutiao" left-icon="shouji" name='mobile' placeholder="请输入手机号" :rules='formRules.mobile' ref="mobile"/>
			<van-field v-model="user.code" clearable icon-prefix="toutiao" left-icon="yanzhengma" name='code' placeholder="请输入验证码" :rules='formRules.code' ref="code">
				<template #button>
					<van-count-down v-if="isCountDownShow" :time="time" :loading='isSendSmsLoading' format="ss s" @finish='isCountDownShow=false'/>
					<van-button v-else size="mini" round class="send-btn" @click.prevent='onSendSms'>发送验证码</van-button>
				</template>
			</van-field>
			<div class="login-btn-wrap">
				<van-button class="login-btn" type="primary" block @click="onLogin">登录</van-button>
			</div>
		</van-form>

	</div>
</template>

<script>
	import {
		login,sendSms
	} from 'network/user.js'
	import {
		Toast
	} from 'vant'
	import {
		log
	} from 'util';

	export default {
		name: 'Login',
		data() {
			return {
				time:1000*60,
				isCountDownShow:false,
				isSendSmsLoading:false,
				user: {
					mobile: "",
					code: ""
				},
				formRules: {
					mobile: [{
							required: true,
							message: '请输入手机号'
						},
						{
							pattern: /^1[3|5|7|8|9]\d{9}$/,
							message: '手机号输入格式错误'
						}
					],
					code: [{
							required: true,
							message: '请输入验证码'
						},
						{
							pattern: /^\d{6}$/,
							message: '验证码格式错误'
						}
					]
				}
			};
		},
		methods: {
			    async onLogin () {
			      if (!this.checkMobile() || !this.checkCode()) {
			        return
			      }
			      Toast.loading({
			        duration: 0, // 持续时间，0表示持续展示不停止
			        forbidClick: true, // 是否禁止背景点击
			        message: '登录中...' // 提示消息
			      })
			      try {
			        const { data } = await login(this.user)
			        // res.data.data => { token: 'xxx', refresh_token: 'xxx' }
			        
			        // 提示 success 或者 fail 的时候，会先把其它的 toast 先清除
			        Toast.success('登录成功')
			        // 跳转到首页
							
							this.$store.commit('setUser', data)
							
							console.log(data)
							// this.$store.commit('removeCachePage', ArticleDetail)
							
			        
							
			        this.$router.replace(this.$route.query.redirect || '/')
							
							
			      } catch (err) {
			        // console.log('登录失败', err)
			        Toast.fail('登录失败，手机号或验证码错误')
			      }
			    },
					async onSendSms () {
						try{
							this.isCountDownShow = !this.isCountDownShow
							// console.log('正在登陆...')
							await this.$refs['login-form'].validate('mobile')
							this.isSendSmsLoading = true
								const res = await sendSms(this.user.mobile)
								// console.log(res)
							}catch(err){
								let message=''
								if(err&&err.response&&err.response===429){
									message='发送过于频繁，请稍后重试'
								} else if (err.name === 'mobile'){
									message = err.message
								}else{
									message = '发送失败,请重新发送'
								}
								Toast({
										message:err.message,
										position:'top'
								})
							}
					  this.isSendSmsLoading = false
					},
		      checkMobile () {
		        const { mobile } = this.user
		        if (!mobile) {
		          Toast({
		            message: '手机号码不能为空',
		            position: 'top'
		          })
							//设置焦点
		          this.$refs.mobile.focus()
		          return false
		        }
		        if (!/^1[3578]\d{9}$/.test(mobile)) {
		          Toast({
		            message: '手机号码格式错误',
		            position: 'top'
		          })
		          this.$refs.mobile.focus()
		          return false
		        }
		        return true
		      },
		      checkCode () {
		        const { code } = this.user
		        if (!code) {
		          Toast({
		            message: '验证码不能为空',
		            position: 'top'
		          })
		          this.$refs.code.focus()
		          return false
		        }
		        if (!/^\d{6}$/.test(code)) {
		          Toast({
		            message: '验证码格式错误',
		            position: 'top'
		          })
		          this.$refs.code.focus()
		          return false
		        }
		        return true
		      }
		}
	}
</script>
<style scoped lang='less'>
	.login-container {
		.send-btn {
			width: 76px;
			height: 23px;
			background-color: #ededed;

			.van-button__text {
				font-size: 11px;
				color: red !important;
			}
		}

		.login-btn-wrap {
			padding: 26px 16px;

			.login-btn {
				background-color: #6db4fb;

				border:none .van-button__text {
					font-size: 15px;
				}
			}
		}
	}
</style>
