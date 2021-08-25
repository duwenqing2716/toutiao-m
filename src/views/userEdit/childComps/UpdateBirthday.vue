<template>
  <div class="update-birthday">
		<van-datetime-picker
		  v-model="currentDate"
		  type="date"
		  title="选择年月日"
		  :min-date="minDate"
		  :max-date="maxDate"
			@confirm="$emit('onBirthConfirm', currentDate)"
			@cancel="$emit('close')"
		/>
	</div>
</template>

<script>
	import { ref } from 'vue'
	
export default {
  name: 'UpdateBirthday',
  components: {},
  props: {
		value:{
			type:String,
			required:true,
			default(){
				return '2000, 2, 4'
			}
		}
	},
  data () {
    return {
      
    }
  },
	setup(props) {
	    const currentDate = ref(new Date(2000, 0, 1))
			
			// const onConfirm = (currentDate) => {
			// 	// console.log(index)
			//   context.emit('onBirthConfirm',currentDate)
			// }
			
	    return {
				// onConfirm,
	      minDate: new Date(1980, 0, 1),
	      maxDate: new Date(),
	      currentDate
	    }
	  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less"></style>
