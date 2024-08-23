<template>
  <div>
    <h2 class="perSetting-h2">绑定邮箱</h2>
    <span>注意：你将修改绑定的邮箱，修改完成后，请使用新的绑定邮箱登录。</span>
    <Form ref="form"   :rules="rules" :model="form"
        label-position="left"  :label-width="150"
          @submit.native.prevent>
      <FormItem label="邮箱" prop="username">
        <span>{{maskCurrentUsername}}</span>
      </FormItem>
      <FormItem label="当前登录邮箱" prop="oldEmail">
        <Input v-model="form.oldEmail"></Input>
      </FormItem>
      <FormItem label="登录密码" prop="password">
        <Input v-model="form.password" type="password"></Input>
      </FormItem>
      <FormItem label="新邮箱" prop="newEmail">
        <Input v-model="form.newEmail"></Input>
      </FormItem>
      <Button :disabled="resendTime != 0" type="info" @click="sendCode">
        <span v-if="resendTime == 0">向新邮箱发送验证码</span>
        <span v-else>向新邮箱发送验证码{{resendTime}}</span>
      </Button>
      <FormItem label="验证码" prop="identifyCode">
        <Input v-model="form.identifyCode"></Input>
      </FormItem>
      <Button type="primary" :loading="submitLoading" @click="submit">确定</Button>
    </Form>
  </div>
</template>

<script>
const {API} = require( "@/common/API_CONST");
const {Utils} = require("@/plugins/Utils");
export default{
  layout:"perSetting",
  data(){
    return {
      form:{
        oldEmail:"",
        password:"",
        identifyCodeId:"",
        identifyCode:"",
        newEmail:"",
      },
      resendTime: 0, /*重新发送及时，120秒内不能重新发送*/
      submitLoading:false,
      rules:{
        oldEmail:[
        {
            required:true,
            message: '必须输入当前登录邮箱',
            trigger: 'blur'
        }],
        password:[
        {
            required:true,
            message: '必须输入密码',
            trigger: 'blur'
        }],
        newEmail:[
        {
            required:true,
            message: '必须输入新邮箱',
            trigger: 'blur'
        },{
            type:"email",
            message: '邮箱格式错误',
            trigger: 'blur'
        }],
      },
    }
  },
  computed: {
    maskCurrentUsername(){
      let email = this.$store.state.auth.user.username;
      return Utils.maskEmail(email);
    },
  },
  async created(){
    this.$store.commit("SET_CURRENT_MENU","ps-bindEmail");
  },
  async mounted(){
  },
  methods:{
    async submit(){
      let valid = await this.$refs.form.validate();
      if(!valid){
        return;
      }
      if(!!!this.form.identifyCodeId){
        this.$Message.error("请先获取验证码");
        return;
      }
      if(!!!this.form.identifyCode){
        this.$Message.error("验证码必须输入");
        return;
      }
      this.submitLoading = true;
      let rt = await this.$axios.post(`${API.PERSETTING_BINDEMAIL}`,
              this.form);

      if(rt.data.code != 1){
        this.$Message.error(rt.data.message);
        this.submitLoading = false;
        return;
      }
      this.$Message.success("修改成功");
      this.submitLoading = false;
      let vm = this;
      setTimeout(()=>{
        vm.$auth.logout();
      },500)
    },
    async sendCode(){
      let valid = await this.$refs.form.validate();
      if(!valid){
        return;
      }
      let rt = await this.$axios.post(`${API.PERSETTING_BINDEMAIL_SENDCODE}`,
              this.form);
      if(rt.data.code != 1){
        this.$Message.error(rt.data.message);
        return;
      }
      this.form.identifyCodeId = rt.data.identifyCodeId;
      this.resendTime = 120;
      this.calResTime();
    },
    async calResTime(){
      if(this.resendTime > 0){
        this.resendTime = this.resendTime - 1;
        setTimeout(this.calResTime,1000);
      }
    },
  },
}
</script>

<style>
</style>
