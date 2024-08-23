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
    <div class="forgetpass-div">
      <div  class="forgetpass-header">
        <span>重置密码</span>
      </div>
      <div class="forgetpass-form" v-if="stage==0">
        <Form :model="formData1"  :rules="rules1" ref="form1"
        label-position="top" @submit.native.prevent>

          <FormItem label="邮箱(请使用个人邮箱)"  prop="username">
            <Input v-model="formData1.username"></Input>
          </FormItem>
          <FormItem label="验证码" prop="identifyCode">
            <Input type="text" name="identifyCode"
            maxlength="4" size="large" class="input-identifyCode"
             v-model="formData1.identifyCode"></Input>
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
            :loading="nextLoading"
           size="large" long @click="next">
            发送验证码到邮箱
          </Button>
        </Form>
      </div>
      <div class="forgetpass-form" v-else>
        <div class="tips-2">
          已向您的邮箱发送了一封包含验证码的邮件。
        </div>
        <div class="tips-3">
          如超过2分钟没有收到验证码邮件，您可以点击
          <span v-if="resendTime == 0"><a @click="reSend">重新发送</a></span>
          <span v-else>重新发送({{resendTime}})</span>。
        </div>
        <Form :model="formData2" :rules="rules2" ref="form2"
        label-position="top" @submit.native.prevent>
          <FormItem label="邮箱(请使用个人邮箱)"  prop="username">
            <Input class="stage2-username-input" v-model="formData2.username" disabled></Input>
          </FormItem>
          <FormItem label="验证码" prop="identifyCode">
            <Input type="text" name="identifyCode"
            maxlength="4" size="large" class="input-identifyCode"
             v-model="formData2.identifyCode"></Input>
          </FormItem>
          <FormItem label="密码"  prop="password">
            <Input v-model="formData2.password" type="password"></Input>
          </FormItem>
          <FormItem label="确认密码"  prop="repeatPassword">
            <Input v-model="repeatPassword" type="password"></Input>
          </FormItem>
          <Button type="success"
            :loading="submitLoading"
           size="large" long @click="resetPassword">
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
    title:"重置密码页面",
  },
  components:{IdentifyCode,},
  async asyncData({ params,query, $axios }) {

    return {
      formData1:{
        username:'',
        identifyCodeId: "",
        identifyCode: "",
      },
      formData2:{
        username:'',
        password: "",
        identifyCodeId:"",
        identifyCode:"",

      },
      repeatPassword:"",
      submitLoading:false,
      nextLoading: false,
      viewIdentifyCode:"",
      stage:0,
      resendTime: 0, /*重新发送及时，120秒内不能重新发送*/
    }
  },
  data(){
    let rePasswordValidator = (rule, value, callback) => {
            if (this.repeatPassword === '') {
                callback(new Error('请输入确认密码'));
            } else if (this.repeatPassword !== this.formData2.password) {
                callback(new Error('两次输入的密码不一致'));
            } else {
                callback();
            }
        };
    return {
      rules1:{
        username:[{
          required:true,
          message:"请输入邮箱"
        },{
          type:"email",
          message: '邮箱格式错误',
        },],
        identifyCode:[{
          required:true,
          message:"请输入验证码"
        },],
      },
      rules2:{
        password:[{
          required:true,
          message:"请输入密码"
        },
        {
            min: 8,
            message: '长度不能少于8',
            trigger: 'blur'
        }],
        identifyCode:[{
          required:true,
          message:"请输入验证码"
        },],
        repeatPassword:[{
          validator:rePasswordValidator,
          trigger: "blur",
        },],
      },
    }
  },
  methods:{
      async resetPassword(){
        let valid = await this.$refs.form2.validate();
        if(!valid){
          return;
        }
        this.submitLoading = true;
        this.$axios.post(`${API.FORGET_PASS_2}`,this.formData2)
        .then((res)=>{
          if(res.data.code < 1){
            if(res.data.message){
              Message.error(res.data.message)
            }else{
              Message.error("发生错误!")
            }
            this.formData2.identifyCode = "";
            this.formData2.password = "";
            this.repeatPassword = "";
            
          }else{
            window.location.href = `/forgetpass_success`;
          }
          this.submitLoading = false;
        });
      },
      async refreshCode(){
        let vue = this;
        vue.formData1.identifyCode = "";
        this.$axios.get(`${API.IDENTIFY_CODE}`)
        .then((res)=>{
          if(!!!res.data.code){
            Message.error("获取验证码失败!")
          }else{
            vue.formData1.identifyCodeId = res.data.codeId;
            vue.viewIdentifyCode = res.data.code;
          }
        });
      },
      async next(){
        let valid = await this.$refs.form1.validate();
        if(!valid){
          return;
        }
        this.nextLoading = true;
        this.$axios.post(`${API.FORGET_PASS_1}`,this.formData1)
        .then((res)=>{
          if(res.data.code < 1){
            if(res.data.message){
              Message.error(res.data.message)
            }else{
              Message.error("发生了错误!")
            }
            this.refreshCode();
          }else{
            this.stage = 1;
            this.resendTime = 120;
            this.calResTime();
            this.formData2.username = this.formData1.username;
            this.formData2.password = "";
            this.repeatPassword = "";
            this.formData2.identifyCodeId = res.data.idtf;
            this.formData2.identifyCode = "";
          }
          this.nextLoading = false;
      });
    },
    async calResTime(){
      if(this.resendTime > 0){
        this.resendTime = this.resendTime - 1;
        setTimeout(this.calResTime,1000);
      }
    },
    async reSend(){
      this.$axios.post(
      `${API.FORGET_PASS_SEND_CODE}`,
      {username:this.formData2.username}
      ).then((res)=>{
        this.formData2.identifyCodeId = res.data.idtf;
        this.formData2.identifyCode = "";
      });

      this.resendTime = 120;
      this.calResTime();
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
  .forgetpass-div{
    width:400px;
    margin: 0 auto;
  }
  .forgetpass-header{
    text-align: center;
  }
  .forgetpass-header span{
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
  .stage2-username-input input{
    color:black !important;
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
