<template>
  <div>
    <h2 class="perSetting-h2">基本信息</h2>
    <Form ref="form"   :rules="rules"
        label-position="left"  :label-width="80"
          @submit.native.prevent>
      <FormItem label="邮箱" prop="username">
        <span>{{maskCurrentUsername}}</span>
      </FormItem>
      <FormItem label="昵称" prop="nickname">
        <span>{{form.user.nickname}}</span>
      </FormItem>
      <FormItem label="性别" prop="gender">
        <RadioGroup v-model="form.info.gender">
          <Radio label="M">
              <span>男</span>
          </Radio>
          <Radio label="F">
              <span>女</span>
          </Radio>
          <Radio label="U">
              <span>保密</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="出生年月" prop="birthMonth">
        <DatePicker type="month"  style="width: 200px"
        :value="form.info.birthMonth"
        @on-change="(e)=>{this.form.info.birthMonth = e;}"
        ></DatePicker>
      </FormItem>
      <FormItem label="个人介绍" prop="intro">
        <Input v-model="form.info.intro" maxlength="200"
         show-word-limit type="textarea" :rows="4">

        </Input>
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
        user:{},
        info:{},
      },
      submitLoading:false,
      rules:{
        intro:[
        {
            max: 200,
            message: '最多输入200个字符',
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
    this.$store.commit("SET_CURRENT_MENU","ps-account");
    let rt = await this.$axios.get(`${API.PERSETTING_ACCOUNT}`);
    this.form.user = rt.data.user;
    this.form.info = rt.data.info;
  },
  async mounted(){
  },
  methods:{
    async submit(){
      let valid = await this.$refs.form.validate();
      if(!valid){
        return;
      }
      this.submitLoading = true;
      let rt = await this.$axios.post(`${API.PERSETTING_ACCOUNT}`,
              this.form.info);
      this.$Message.success("保存成功");
      this.submitLoading = false;
    },
  },
}
</script>

<style>
</style>
