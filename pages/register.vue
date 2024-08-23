<template>
  <div class="container">
    <div class="logo-header">
        <div class="logo-text">
          <span>vyoke.com</span>
        </div>
        <div class="logo-img">
          <img src="@/assets/images/logo.png" />
        </div>
    </div>
    <div class="register-div">
      <div  class="register-header">
        <span>注册</span>
      </div>
      <div class="register-form">
        <Form :model="formData" :rules="rules" ref="regForm"
        label-position="top" @submit.native.prevent>
          <FormItem label="邮箱(请使用个人邮箱)"  prop="username">
            <Input v-model="formData.username"></Input>
          </FormItem>
          <FormItem label="密码"  prop="password">
            <Input v-model="formData.password" type="password"></Input>
          </FormItem>
          <FormItem label="确认密码"  prop="repeatPassword">
            <Input v-model="repeatPassword" type="password"></Input>
          </FormItem>
          <FormItem label="昵称(1-10个字符,允许重名)"  prop="nickname">
            <Input v-model="formData.nickname"></Input>
          </FormItem>
          <FormItem label="验证码" prop="identifyCode">
            <Input type="text" name="identifyCode"
            maxlength="4" size="large" class="input-identifyCode"
             v-model="formData.identifyCode"></Input>
            <div class="div-identifyCode">
              <a @click="refreshCode">
                <IdentifyCode :identifyCode="viewIdentifyCode"></IdentifyCode>
              </a>

              <Button class="refreshCode" type="text"
               icon="md-refresh" @click="refreshCode">

              </Button>
            </div>
          </FormItem>
          <Button type="primary"
            :loading="submitLoading"
           size="large" long @click="doReg">
            提交
          </Button>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import IdentifyCode from '@/components/IdentifyCode';
const {API} = require( "@/common/API_CONST");
import { Message } from 'view-design'
export default {
  auth:false,
  layout:"single",
  head:{
    title:"注册页面",
  },
  components:{IdentifyCode,},
  async asyncData({ params,query, $axios }) {

    return {
      formData:{
        username:'',
        password: "",
        nickname:"",
        identifyCodeId: "",
        identifyCode: "",
      },
      repeatPassword:"",
      submitLoading:false,
      viewIdentifyCode:"",
    }
  },
  data(){
    let rePasswordValidator = (rule, value, callback) => {
            if (this.repeatPassword === '') {
                callback(new Error('请输入确认密码'));
            } else if (this.repeatPassword !== this.formData.password) {
                callback(new Error('两次输入的密码不一致'));
            } else {
                callback();
            }
        };
    let userExistValidator = async (rule, value, callback) => {
          let res = await this.$axios.get(
          `${API.REGISTER_CHECK_USERNAME_EXIST}/${this.formData.username}`
          );
          if(res.data > 0){
            callback(new Error('该用户名已经存在，请换一个用户名.'));
          }else{
            callback();
          }
        };
    return {
      rules:{
        username:[{
          required:true,
          message:"请输入邮箱"
        },{
          type:"email",
          message: '邮箱格式错误',
        },{
          validator:userExistValidator,
          trigger: "blur",
        },],
        password:[{
          required:true,
          message:"请输入密码"
        },
        {
            min: 8,
            message: '长度不能少于8',
            trigger: 'blur'
        }],
        repeatPassword:[{
          validator:rePasswordValidator,
          trigger: "blur",
        },],
        nickname:[{
          required:true,
          message:"请输入昵称"
        },
        {
            min: 1,max: 10,
            message: '长度必须是 1 - 10个字符',
            trigger: 'blur'
        },],
        identifyCode:[{
          required:true,
          message:"请输入验证码"
        },],
      },
    }
  },
  methods:{
      async doReg(){
        let valid = await this.$refs.regForm.validate();
        if(!valid){
          return;
        }
        this.submitLoading = true;
        this.$axios.post(`${API.REGISTER_DO_REG}`,this.formData)
        .then((res)=>{
          if(res.data.code < 1){
            if(res.data.message){
              Message.error(res.data.message)
            }else{
              Message.error("注册失败!")
            }
            this.submitLoading = false;
            this.refreshCode();
          }else{
            const {Utils} = require('@/plugins/Utils');
            let encrypted = Utils.encryptAes(this.formData.username,
             this.formData.username.length + "");
             encrypted = encodeURIComponent(encrypted +
              Utils.encryptSplitChars+ this.formData.username.length)
            window.location.href = `/reg_success/${encrypted}`;
          }
          this.submitLoading = false;
        });
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
  },
  async mounted(){
  },
  async created(){
    this.refreshCode();
  }
}
</script>

<style>
  .container{
    width:100%;
    padding-bottom: 100px;
  }
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
  .register-div{
    width:400px;
    margin: 0 auto;
  }
  .register-header{
    text-align: center;
  }
  .register-header span{
    margin-top: 5px;
    font-size: 16px;
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
</style>
