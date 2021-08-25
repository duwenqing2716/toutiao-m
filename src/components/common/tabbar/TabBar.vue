<template>
  <div>
      <van-tabbar v-model="active" route>
      <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="comment-o" to="/video">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o" to="/profile">视频</van-tabbar-item>
      <van-tabbar-item icon="manager-o" to="/login">我的</van-tabbar-item>
      </van-tabbar>
  </div>
</template>

<script>


export default {
  name:'TabBar',
  data () {
    return {
        active: 0,
    };
  },
}

</script>
<style scoped>
</style>