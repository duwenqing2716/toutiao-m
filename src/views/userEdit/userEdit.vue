<template>
	<div>
		<van-nav-bar class="app-nav-bar" title="个人信息" left-arrow @click='$router.back()' />
		<van-cell-group>
			<input type="file" hidden="hidden" ref='file' accept="image/*" @change="onFileChange">
			<van-cell is-link center @click="$refs.file.click()">
				<template #title>
					<span>头像</span>
				</template>
				<template #value>
					<van-image class="avatar" round fit="cover" :src="user.photo" />
				</template>
			</van-cell>
			<van-cell is-link center @click="showNamePopup">
				<template #title>
					<span>昵称</span>
				</template>
				<template #value>
					<span>{{ user.name }}</span>
				</template>
			</van-cell>
			<van-cell is-link center @click='showGenderPopup'>
				<template #title>
					<span>性别</span>
				</template>
				<template #value>
					<span>{{ user.gender === 0 ? '男' : '女'}}</span>
				</template>
			</van-cell>
			<van-cell is-link center @click='showBirthPopup'>
				<template #title>
					<span>生日</span>
				</template>
				<template #value>
					<span>{{ user.birthday }}</span>
				</template>
			</van-cell>
		</van-cell-group>

		<!-- 修改昵称 -->
		<van-popup v-model:show="isEditNameShow" style="height: 100%;" class="intro-popup" position="bottom" get-container="body">
			<!-- v-if的条件渲染，提高性能当需要时再渲染 -->
			<update-name :name='user.name' @cancel='onCancel' @confirm='onConfirm' v-if="isEditNameShow"></update-name>
		</van-popup>
		<!-- /修改昵称 -->

		<!-- 修改性别 -->
		<van-popup position="bottom" get-container="body"  v-model:show="isEditGenderShow" style="height: 60%;">
			<update-gender @genderConfirm='onGenderConfirm' :index="user.gender" @close='onCancel'></update-gender>
		</van-popup>

		<van-popup position="bottom" v-model:show="isEditBirthShow" style="height: 60%;">
			<update-birthday :value="user.birthday" @close='onCancel' @onBirthConfirm='onBirthConfirm'></update-birthday>
		</van-popup>
		<!-- /修改生日 -->

		<!-- 上传头像预览裁切 -->
		<van-popup style="height: 100%; background-color: #000" position="bottom" v-model:show="isEditPhotoShow">
			<update-avatar :file='previewImage' @close='onCancel' @update-photo='updatePhoto' v-if="isEditPhotoShow"></update-avatar>
		</van-popup>

	</div>
</template>

<script>
	import { ref } from 'vue';
	
	import { Toast } from 'vant'
	import dayjs from 'dayjs'

	import { getUserProfile,updateUserProfile,updateUserPhoto } from 'network/user.js'
	
	import UpdateName from './childComps/UpdateName.vue'
	import UpdateGender from './childComps/UpdateGender.vue'
	import UpdateBirthday from './childComps/UpdateBirthday.vue'
	import UpdateAvatar from './childComps/UpdateAvatar.vue'
	
	export default {
		name: 'userEdit',
		components: {
      UpdateName,
			UpdateGender,
			UpdateBirthday,
			UpdateAvatar
		},
		setup() {
			const isEditNameShow = ref(false);
			
			const isEditGenderShow = ref(false);
			
			const isEditBirthShow = ref(false);
			
			const isEditPhotoShow = ref(false);
			
			const showNamePopup = () => {
				isEditNameShow.value = true;
			}
			
			const showGenderPopup = () => {
				isEditGenderShow.value = true;
			}
			
			const showBirthPopup = () => {
				isEditBirthShow.value = true;
			}
			
			const showPhotoPopup = () => {
				isEditPhotoShow.value = true;
			}
			
			return {
				isEditNameShow,
				showNamePopup,
				isEditGenderShow,
				showGenderPopup,
				isEditBirthShow,
				showBirthPopup,
				isEditPhotoShow,
				showPhotoPopup
			}
		},
		data() {
			return {
				user: {},
				previewImage:null
			}
		},
		computed: {

		},
		created() {
			this.loadUserProfile()
		},
		methods: {
			loadUserProfile() {
				getUserProfile().then(res => {
					// console.log(res)
					const resData = res.data
					// console.log(resData)
					this.user = resData
				})
			},
			onCancel(){
				this.isEditNameShow = false
				this.isEditGenderShow = false
				this.isEditBirthShow = false
				this.isEditPhotoShow = false
			},
			onConfirm(name){
				// v-model == sync v-model在2.x只能用一次，而sync可以用多次
				// 二者都必须与子组件配合  常用数据绑定v-model,不太常用的数据绑定为sync
				// 在 3.x 中，自定义组件上的 v-model 相当于传递了 modelValue prop 并接收抛出的 update:modelValue
				// 父传值：v-model:xxx=""
				// 2）子接收：用props接收
				// 3）子传父：context.emit(“update:xxx”,value)
				// 4）注意：在 setup() 函数中无法访问到 this
				
				Toast.loading({
					message: '保存中',
					forbidClick: true
				}) 
				
				try{
					updateUserProfile(name)
					
					Toast.success('修改成功')
				}catch(err){
					if(err && err.response && err.response.status === 409){
						Toast.fail('昵称已存在')
					}else{
						Toast.fail('修改昵称失败')
					}
				}

				this.user.name = name
				this.isEditNameShow = false
			},
			onGenderConfirm(index,value){
				
				Toast.loading({
					message: '保存中',
					forbidClick: true
				}) 
				
				try{
					updateUserProfile({
						gender: value
					})
					
					Toast.success('修改成功')
				}catch(err){
					if(err && err.response){
						Toast.fail('修改性别失败')
					}
				}
				
				
				this.user.gender = index
				this.isEditGenderShow = false
			},
			onBirthConfirm(currentDate){
				const currentInfo = dayjs(currentDate).format('YYYY-MM-DD')
				// console.log(current)
				
				Toast.loading({
					message: '保存中',
					forbidClick: true
				}) 
				
				try{
					updateUserProfile({
						birthday: currentInfo
					})
					Toast.success('修改成功')
				}catch(err){
					if(err && err.response){
						Toast.fail('修改生日失败')
					}
				}

				this.user.birthday = currentInfo
				this.isEditBirthShow = false
			},
			onFileChange(){
				//清空value，防止相同文件不触发事件
				
				
				this.showPhotoPopup()
				// console.log(,this.$refs.file.value)
				const file = this.$refs.file.files[0]
				console.log(file)
				this.previewImage = file
        this.$refs.file.value = ''
			},
			updatePhoto(image){
				console.log(image,'123')
				this.user.photo = image
			}
		}
	}
</script>

<style scoped lang="less">
	.intro-popup {
		background-color: #f5f7f9;

		.intro-field-wrap {
			padding: 10px;
		}
	}

	.avatar {
		width: 30px;
		height: 30px;
	}

	/deep/ .van-image-preview__cover {
		left: 0;
		bottom: 0;
		right: 0;
		top: unset;

		.van-nav-bar {
			background: #000;
		}
	}

	.crop-bottom {
		position: fixed;
		bottom: 0;
		height: 44px;
		font-size: 16px;
		color: #fff;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px;
	}
</style>
