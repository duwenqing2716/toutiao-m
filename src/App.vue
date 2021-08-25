<template>
	<div id="nav">
		<!-- router-view此处渲染的都是一级路由 -->
		<!-- 一级路由可以切换到其他一级路由的子路由 -->
		<!-- 但如若需在二级路由之间进行组件缓存，则需要在相应的页面进行相同操作 -->
		<router-view v-slot="{ Component }">
				<keep-alive  :exclude="['cachePages','search']">
					<component :is="Component" />
				</keep-alive>
		</router-view>

		<!-- <keep-alive>
			<router-view />
		</keep-alive>-->
		<tab-bar /> 
	</div>

</template>
<script>
	import TabBar from 'components/common/tabbar/TabBar.vue'
	
	import { mapState } from 'vuex'

	export default {
		name: 'App',
		data() {
			return {};
		},
		components: {
			TabBar
		},
		computed:{
			...mapState(['cachePages'])
		}
	}
</script>

<style lang="less">

</style>
