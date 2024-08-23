<template>
  <div>
    <div class="logo-header">
        <div class="logo-text">
          <span>vyoke.com</span>
        </div>
        <div class="logo-img">
          <img src="@/assets/images/logo.png" />
        </div>
    </div>
    <div class="login-div">
      <div  class="login-header">
        <span>请登录</span>
      </div>
      <div class="login-form">
        <Form :model="formData"  :rules="rules" ref="loginForm"
        label-position="top"
          @submit.native.prevent>
          <FormItem label="邮箱" prop="username">
            <Input type="text" name="username"
              size="large" placeholder="xxxx@xx.com"
             @on-enter="login" v-model="formData.username"></Input>
          </FormItem>

          <FormItem label="密码" prop="password">
          <Input type="password" name="password" size="large"
           @on-enter="login" v-model="formData.password"></Input>
          </FormItem>
          <FormItem label="验证码" prop="identifyCode">
            <Input type="text" name="identifyCode"
            maxlength="4" size="large" class="input-identifyCode"
             @on-enter="login" v-model="formData.identifyCode"></Input>
            <div class="div-identifyCode">
              <a @click="refreshCode">
                <IdentifyCode :identifyCode="viewIdentifyCode"></IdentifyCode>
              </a>

              <Button class="refreshCode" type="text"
               icon="md-refresh" @click="refreshCode">

              </Button>
            </div>
          </FormItem>
          <Button type="primary" class="login-btn"
            :loading="loginLoading"
           size="large" long @click="login">
            登录
          </Button>
          <div class="more_actions_div">
            <a class="reg_link" @click="register">
              注册
            </a>
            <a class="forget_link" @click="forget">
              忘记密码
            </a>

          </div>
        </Form>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import IdentifyCode from '@/components/IdentifyCode';
import { Message } from 'view-design'
const {API} = require( "@/common/API_CONST");
export default {
  // auth:false,
  layout:"single",
  head:{
    title:"登录页面",
  },
  components:{IdentifyCode,},
  async asyncData({ params,query, $axios }) {
    return {
      formData:{
        username:'',
        password: "",
        identifyCodeId: "",
        identifyCode: "",
      },
      viewIdentifyCode:"",
    }
  },
  data(){
    let data = {
      loginLoading:false,
      rules:{
        username:[{
          required:true,
          message:"请输入邮箱"
        },],
        password:[{
          required:true,
          message:"请输入密码"
        },],
        identifyCode:[{
          required:true,
          message:"请输入验证码"
        },],
        },
      };
    return data;
  },
  methods:{
      async login(){
          let valid = await this.$refs.loginForm.validate();
          if(!valid){
            return;
          }
          const userInfo = this.formData;
          this.loginLoading = true;
          let ret = await this.$auth.loginWith(
          'vyoke',
          { data: userInfo },
          );
          let result = ret.data;
          //用户未激活
          if (result.code == -2) {
            this.loginLoading = false;
            const {Utils} = require('@/plugins/Utils');
            let encrypted = Utils.encryptAes(this.formData.username,
             this.formData.username.length + "");
             encrypted = encodeURIComponent(encrypted +
              Utils.encryptSplitChars+ this.formData.username.length)
            window.location.href = `/reg_success/${encrypted}`;
            return false;
          }


          // 失败
          if (result.code != 1) {
            this.refreshCode();
            this.loginLoading = false;
            this.$Message.error({
              content: result.message,
              duration: 2,
              closable: true
            })
            return false
          }
          this.loginLoading = false;
      },
      async refreshCode(){
        let vue = this;
        vue.formData.identifyCode = "";
        this.$axios.get(`${API.IDENTIFY_CODE}`)
        .then((res)=>{
          if(!!!res.data.code){
            Message.error("获取验证码失败!")
          }else{
            vue.formData.identifyCodeId = res.data.codeId;
            vue.viewIdentifyCode = res.data.code;
          }
        });
      },
      register(){
        this.$router.push("/register");
      },
      forget(){
        this.$router.push("/forgetpass");
      },
  },
  async created(){
    this.refreshCode();
  }
}
</script>

<style>
  .logo-header{
    margin-top: 50px;
  }
  .logo-text{
    text-align: center;
  }
  .logo-text span{
    font-size: 30px;
    font-weight: bold;
  }
  .logo-img{
    text-align: center;
  }
  .logo-img img{
    width:100px;
  }
  .login-div{
    width:400px;
    margin: 0 auto;
  }
  .login-header{
    text-align: center;
  }
  .login-header span{
    margin-top: 5px;
    font-size: 16px;
  }
  .more_actions_div{
    float:left;
    width:100%;
  }
  .reg_link{
    float:left;
    margin-left: 5px;
    margin-top: 10px;
    font-size: 14px;
  }
  .forget_link{
    float:right;
    margin-right: 5px;
    margin-top: 10px;
    font-size: 14px;
  }
  .input-identifyCode{
    width:100px;
  }
  .div-identifyCode{
    float:right;
  }
  .div-identifyCode .s-canvas{
    float:right;
  }
  .div-identifyCode .refreshCode{
    float:right;
    margin-bottom: 2px;
  }
  .login-btn span{
    font-size: 16px;
  }
</style>
