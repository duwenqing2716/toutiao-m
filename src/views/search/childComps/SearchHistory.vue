<template>
	<div class="search-history">
		<van-cell>
			<template #title>
				<span>搜索历史</span>
			</template>
			<template #value>
				<div v-if='isDeleteShow'>
					<span @click="onDeleteAll">全部删除 &nbsp &nbsp</span>
					<span @click='isDeleteShow = false'> 取消</span>
				</div>
				<van-icon name="delete" v-else @click='isDeleteShow = true' />
			</template>
		</van-cell>
		<van-cell v-for="(item,index) in search" :key='index' @click='onDelete(item,index)'>
			<template #title>
				<span>{{item}}</span>
			</template>
			<template #value>
				<van-icon name="close" v-show="isDeleteShow" />
			</template>
		</van-cell>
	</div>
</template>


<script>
	import { ref } from 'vue';
	
	import { Toast } from 'vant'
	
	import { setItem } from 'network/storage.js'
	
	export default {
		name: 'SearchHistory',
		components: {},
		props: {
			search: {
				type: Array,
				required: true,
				default () {
					return []
				}
			}
		},
		setup() {
			const isDeleteShow = ref(false)

			return {
				isDeleteShow
			}
		},
		data() {
			return {}
		},
		computed: {},
		watch: {},
		created() {},
		mounted() {},
		methods: {
      onDelete(item,index){
				if(this.isDeleteShow){
					this.search.splice(index,1)
					setItem('search-histories',this.search)
				}else{
					this.$emit('search',item)
				}
			},
			onDeleteAll(){
				this.$dialog.confirm({
				  // title: '删除历史记录确认',
				  message: '确认删除所有历史记录吗?'
				}).then(() => {
				  // 确认执行这里
					// 因为props中的数据具有只读写的特征,不能重新赋值,因此不能直接将数据设置为[]
					// 方法一:传递给父组件进行赋值
					// this.$emit('update-histories',[])
					
					// 方法二:设置length,有些浏览器可能会失效或者只读
					// this.search.length=0 
					
					// 方法三:
				  this.search.splice(0,this.search.length)
					
					// 其余方法性能低不建议使用
				  // 清除容器和本地存储的数据
				  setItem('search-histories',this.search)
					
					this.isDeleteShow = false
				}).catch(() => {
				  // 取消执行这里
				})
			}
		},
		watch: {}
	}
</script>
<style scoped lang="less"></style>
