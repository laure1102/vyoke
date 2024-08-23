<template>
  <div class="app">
    <div v-if="status == 0">
      <div class="tips-header">您的账户已经注册成功!但是处于未激活状态:</div>
      <div class="tips-2">
        已向您的邮箱{{username}}发送了一封激活邮件，您的账户在未激活前不能使用。
      </div>
      <div class="tips-3">
        如超过2分钟没有收到激活邮件，您可以点击
        <span v-if="resendTime == 0"><a @click="reSend">重新发送</a></span>
        <span v-else>重新发送({{resendTime}})</span>。
      </div>
    </div>
    <div v-if="status == 1">
      <div class="tips-header">您的账户已经激活</div>
      <div class="tips-3">
        点击<a href="/login">登录</a> 返回登录页面。
      </div>
    </div>
    <div v-if="status == -1">
      <div class="tips-header">出错啦</div>
    </div>
  </div>
</template>

<script>
const {API} = require( "@/common/API_CONST");
export default {
  auth:false,
  data(){
    return {
      status : 0, /*0-未激活，1-已激活，-1 - 出错*/
      resendTime: 0, /*重新发送及时，120秒内不能重新发送*/
      username:"",
    }
  },
  computed: {
  },
  async created(){
    const {Utils} = require('@/plugins/Utils');
   this.username = decodeURIComponent(this.$route.params.username);
   let arr = this.username.split(Utils.encryptSplitChars);
   if(arr.length != 2){
      this.status = -1;
      return;
   }

   let encrypted = arr[0];
   let length = arr[1];
   try{
    this.username = Utils.decryptAes(encrypted, length);
   }catch(error){
     console.log(error)
      this.status = -1;
      return;
   }
    //判断username是不是邮箱
    if(!this.isEmail(this.username)){
      this.status = -1;
      return;
    }

    // 判断账户是否存在
    // 判断username是否已经激活
    try{
      let res = await this.$axios.get(
      `${API.REGISTER_CHECK_USERNAME_EXIST}/${this.username}`
      );
      if(res.data == 0){
        this.status = -1;
        return;
      }
      if(res.data == 1){ //已激活
        this.status = 1;
        return;
      }
      if(res.data == 2){ //未激活
        this.status = 0;
        this.resendTime = 120;
        this.calResTime();
        return;
      }
    }catch(error){
      console.log(error)
      this.status = -1;
      return;
    }

  },
  methods:{
    isEmail(p){
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailPattern.test(p);
    },
    async calResTime(){
      if(this.resendTime > 0){
        this.resendTime = this.resendTime - 1;
        setTimeout(this.calResTime,1000);
      }
    },
    async reSend(){
      this.$axios.get(
      `${API.REGISTER_SEND_ACTIVE}/${this.username}`
      );

      this.resendTime = 120;
      this.calResTime();
    },
  }
}

</script>

<style>
  .app{
    text-align: center;
    margin-top: 100px;
  }
  .tips-header{
    font-size: 16px;
    font-weight: bold;
  }

  .tips-2{
    margin-top: 20px;
    font-size: 14px;
  }
  .tips-3{
    margin-top: 20px;
    font-size: 14px;

  }
  .tips-3 a{
    font-size: 14px;

  }
</style>
