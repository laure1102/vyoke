<template>
  <div>
    登出了哦,3秒后返回首页
  </div>
</template>

<script>
export default {
  auth:false,
  async mounted(){
    setTimeout(()=>{
      window.location.href= "/";
    },3000)
  }
}
</script>

<style>
</style>
