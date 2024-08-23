<template>
  <div>
    <h2 class="perSetting-h2">修改密码</h2>
    <Form ref="form"   :rules="rules" :model="form"
        label-position="left"  :label-width="80"
          @submit.native.prevent>
      <FormItem label="邮箱" prop="username">
        <span>{{maskCurrentUsername}}</span>
      </FormItem>
      <FormItem label="旧密码" prop="oldPassword">
        <Input  v-model="form.oldPassword" type="password"></Input>
      </FormItem>
      <FormItem label="新密码" prop="password">
        <Input v-model="form.password" type="password"></Input>
      </FormItem>
      <FormItem label="密码确认" prop="repeatPassword">
        <Input v-model="form.repeatPassword" type="password"></Input>
      </FormItem>
      <Button type="primary" :loading="submitLoading" @click="submit">
        确定
      </Button>
    </Form>
  </div>
</template>

<script>
const {API} = require( "@/common/API_CONST");
const {Utils} = require("@/plugins/Utils");
export default{
  layout:"perSetting",
  data(){
    let rePasswordValidator = (rule, value, callback) => {
            if (this.form.repeatPassword === '') {
                callback(new Error('请输入确认密码'));
            } else if (this.form.repeatPassword !== this.form.password) {
                callback(new Error('两次输入的密码不一致'));
            } else {
                callback();
            }
        };
    return {
      form:{
        oldPassword:"",
        password:"",
        repeatPassword:"",
      },
      submitLoading:false,
      rules:{
        oldPassword:[{
          required:true,
          message:"请输入旧密码"
        },],
        password:[{
          required:true,
          message:"请输入新密码"
        },
        {
            min: 8,
            message: '最少输入8个字符',
            trigger: 'blur'
        }],
        repeatPassword:[{
          validator:rePasswordValidator,
          trigger: "blur",
        },],
      },
    }
  },
  computed: {
    maskCurrentUsername(){
      let email = this.$store.state.auth.user.username;
      return Utils.maskEmail(email);
    },
  },
  created(){
    this.$store.commit("SET_CURRENT_MENU","ps-changePswd");
  },
  methods:{
    async submit(){
      let valid = await this.$refs.form.validate();
      if(!valid){
        return;
      }
      this.submitLoading = true;
      let rt = await this.$axios.post(`${API.PERSETTING_CHANGEPSWD}`,
              this.form);
      if(rt.data.code == 1){
        this.$Message.success("密码修改成功");
        this.submitLoading = false;
        let vm = this;
        setTimeout(()=>{
          vm.$auth.logout();
        },500)
      }else{
        this.$Message.error(rt.data.message);
      }
      this.submitLoading = false;
    },
  },
}
</script>

<style>
</style>
