<template>
  <div class="update-avatar">
		
    <img :src="image" alt="" ref='image' class="image">
		<van-nav-bar
		  title="图片裁剪"
		  left-text="取消"
			class="toolbar"
		  right-text="完成"
		  @click-left="$emit('close')"
		  @click-right="onConfirm"
		/>
  </div>
</template>

<script>
	import { getUserProfile,updateUserProfile,updateUserPhoto } from 'network/user.js'
	
	import { Toast } from 'vant'
	
	import Cropper from 'cropperjs'
	import 'cropperjs/dist/cropper.css'
	
export default {
  name: 'UpdateAvatar',
  components: {},
  props: {
		file:{
			required:true
		}
	},
	setup(props,context){

	},
  data () {
    return {
			image: window.URL.createObjectURL(this.file),
			cropper:null
		}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
		const image = this.$refs.image;
		console.log(image)
		
		this.cropper = new Cropper(image, {
		  // aspectRatio: 16 / 9,
		    viewMode: 1,
		    dragMode: 'move',
		    aspectRatio: 1,
		    autoCropArea: 1,
		    cropBoxMovable: false,
		    cropBoxResizable: false,
		    background: false,
		    movable: true
		})
		// console.log(cropper)
	},
  methods: {
		getCroppedCanvas(){
			return new Promise( resolve => {
				this.cropper.getCroppedCanvas().toBlob( blob => {
					resolve(blob)
				})
			})
		},
		async onConfirm(){
			// console.log(file)
			Toast.loading({
				message: '保存中',
				forbidClick: true,
				duration: 0
			}) 
			
			const file = await this.getCroppedCanvas()
			// 如果内容要求content-type 是multipart/form-data,则一定要提交FormData数据对象,专门用于文件上传,不能提交{}
			const fd = new FormData()
			fd.append('photo', this.file)
			
			
			try{
				updateUserPhoto(fd)
				Toast.success('修改成功')
			}catch(err){
				if(err && err.response){
					Toast.fail('修改头像失败')
				}
			}
			this.$emit('update-photo',  window.URL.createObjectURL(file))
			
			this.$emit('close')
			// this.user.photo = file
			// this.isEditPhotoShow = false
		}
	}
}
</script>

<style scoped lang="less">
	.van-nav-bar{
		background-color: transparent;
		/deep/ .van-nav-bar__text{
			color: white;
		}
		/deep/ .van-nav-bar__title{
			color: white;
		}
	}
	
  .toolbar{
		position: fixed;
		left: 0;
		bottom: 0;
		right: 0;
	}
	.image{
		display: block;
		max-width: 100%;
	}
</style>

