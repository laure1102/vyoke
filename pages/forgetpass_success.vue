<template>
  <div>
    密码修改成功，3秒后返回登录页面
  </div>
</template>

<script>
export default {
  auth:false,
  async mounted(){
    setTimeout(()=>{
      window.location.href= "/login";
    },3000)
  }
}
</script>

<style>
</style>
