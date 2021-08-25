<template>
  <div class="update-gender">
    <van-picker
		:default-index="index"
      title="性别"
      :columns="columns"
      @confirm="onConfirm"
      @cancel="onCancel"
      @change="onChange"
    />
  </div>
</template>

<script>
	import { Toast } from 'vant';
	
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    index:{
			type:Number,
			required:true,
			default(){
				return 0
			}
		}
  },
	setup(props,context) {
	    const columns = ['男', '女']
	
	    const onConfirm = (value, index) => {
				console.log(index)
	      context.emit('genderConfirm',index,value)
	    }
			
	    const onChange = (value, index) => {
	      Toast(`选择性别: ${value}`)
	    }
			
	    const onCancel = () => {
				context.emit('close')
			}
	
	    return {
	      columns,
	      onChange,
	      onCancel,
	      onConfirm,
	    }
	  },
  data () {
    return {
      
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less">
	
</style>