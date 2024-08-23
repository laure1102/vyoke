<template>
  <div>
    <h2 class="perSetting-h2">搜索引擎设置</h2>
    <br>
    <Button type="primary" @click="addOne">添加一个</Button>
    <List>
      <ListItem v-for="(it,i) in list">
          <ListItemMeta :avatar="it.icoUrl"
           :title="it.name" :description="it.addr" />
          <template slot="action">
            <span v-if="it.dft == 'Y'">默认</span>
            <li v-else><a @click="setDft(it)">设为默认</a>
            <li>
                <a @click="edit(it)">编辑</a>
            </li>
            <li>
                <a @click="remove(it)">删除</a>
            </li>
          </template>
      </ListItem>
  </List>
  <Drawer
      v-model="editModal"
      width="420"
      :mask-closable="false"
  >
  <template slot="header">
    <span v-if="editForm.action=='edit'"><strong>编辑搜索引擎</strong></span>
    <span v-else><strong>添加搜索引擎</strong></span>
  </template>
  <Form :model="editForm" ref="editForm" :rules="rules"
        label-position="top"
          @submit.native.prevent>
    <FormItem label="名称" prop="name">
      <Input v-model="editForm.name"></Input>
    </FormItem>
    <span>搜索地址包含搜索的关键字变量{key}</span>
    <span>例如:https://www.google.com/search?q={key}</span>
    <FormItem label="搜索地址" prop="addr">
      <Input v-model="editForm.addr" type="textarea" :rows="4"
        show-word-limit maxlength="250"></Input>
    </FormItem>
    <Button :loading="submitLoading" type="primary" @click="okEdit">确定</Button>
    <Button @click="editModal=false">取消</Button>
  </Form>
  </Drawer>
  </div>
</template>

<script>
const {API} = require( "@/common/API_CONST");
const {Utils} = require("@/plugins/Utils");
const {DEFAULT_SELIST} = require( "@/common/CONSTS");
export default{
  layout:"perSetting",
  data(){
    return {
      defualtList:DEFAULT_SELIST,
      list:[],
      editForm:{
      },
      editModal:false,
      submitLoading:false,
      rules:{
        name:[{
          required:true,
          message:"请输入名称"
        },],
        addr:[{
          required:true,
          message:"请输入搜索地址"
        },
        {
            max: 250,
            message: '最多输入250个字符',
            trigger: 'blur'
        }],
      },
    }
  },
  computed: {
  },
  async created(){
    this.$store.commit("SET_CURRENT_MENU","ps-searchEngine");
    this.fetchList();

  },
  methods:{
    async fetchList(){
      //获取用户的引擎列表
      this.list = []
      let rt = await this.$axios.get(`${API.PERSETTING_SEARCHENGINE}`);
      this.list = rt.data;
      if(this.list.length == 0){
        let i = 0;
        for(let it of this.defualtList){
          //默认
          this.list.push({
            name: it.name,
            addr: it.addr,
            dft: i == 0 ? "Y" :"N",
            action: "default",
          });
          i++;
        }
      }else{
        for(let it of this.list){
          it.action = "nono";
        }
      }
      for(let it of this.list){
        it.icoUrl = Utils.getFullDomainFromURL(it.addr) + "/favicon.ico";
      }
    },
    async putList(){
      this.submitLoading = true;
      let rt = await this.$axios.post(`${API.PERSETTING_SEARCHENGINE}`,
      {list:this.list});
      this.submitLoading = false;
      this.fetchList();
    },
    async addOne(){
      this.editForm = {
        name: "",
        addr: "",
        icoUrl: "",
        dft:"N",
        action:"add",
      };
      this.editModal = true;
    },
    async okEdit(){
      let valid = this.$refs.editForm.validate();
      if(!valid){
        return;
      }
      if(this.editForm.action == "add"){
        this.list.push(this.editForm);
      }

      await this.putList();
      this.editModal = false;
    },

    async setDft(it){
      for(let d of this.list){
        if(d.name == it.name){
          d.dft = "Y";
        }else{
          d.dft = "N";
        }
      }
      this.putList();
    },

    async edit(it){
      this.editForm = it;
      this.editModal = true;
    },
    async remove(it){
      let vm = this;
      let func = ()=>{
        let index = -1;
        for(let i = 0;i < vm.list.length; i++){
          if(vm.list[i].name == it.name){
            index = i;
          }
        }
        if(index >= 0){
          vm.list.splice(index , 1);
        }
        this.putList();
      };
      this.$Modal.confirm({
        title: "警告",
        content: "确认删除该搜索引擎",
        loading: false,
        onOk: func,
      });
    },

  },
}
</script>

<style>
</style>
