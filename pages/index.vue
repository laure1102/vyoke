<template>
  <div id="index-page">
    <Row class="index-layout">
      <Col span="6" class="index-left">left</Col>
      <Col span="18">
        <Row>
          <Col span="18">
            <div class="index-header">
              <img src="@/assets/images/logo.png">
              <div class="index-logo-txt">vyoke.com</div>
              <div class="index-search-type">
                <Select v-model="searchType" style="width:150px;padding:1px;">
                    <img v-if="!!searchType" class="selected-type-icon"
                     :src="getSelectSearchType().icoUrl" slot="prefix"/>
                    <Option v-for="(item, i) in seList"
                     :value="item.name" :key="i">
                     <div class="search-type-item">
                       <img :src="item.icoUrl"/>
                     </div>
                    {{ item.name }}
                     </Option>
                </Select>
              </div>
              <div  class="index-search">
                <Input v-model="searchWords"  @on-search="goSearch"
                size="large" search enter-button placeholder="输入关键字"/>
              </div>
            </div>
            </Col>
            <Col span="6">
              <div class="index-fav">
                <a @click="addToFavorites">
                    收藏本站
                </a>
              </div>
              <div class="index-user" v-if="loggedIn">
                <Dropdown @on-click="userDropdownAction">
                    <a href="javascript:void(0)"  class="index-user-name">
                        {{user.nickname}}
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="setting" >设置</DropdownItem>
                        <DropdownItem name="logout" divided>登出</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
              </div>
              <div class="index-user" v-else>
                <a href="/login"  class="index-user-name">
                  登录
                </a>
              </div>
          </Col>
        </Row>
        <Row>
          <Col span="24">content</Col>
        </Row>
        <Row>
          <Col span="24">footer</Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
const {API} = require( "@/common/API_CONST");
const {Utils} = require("@/plugins/Utils");
const {DEFAULT_SELIST} = require( "@/common/CONSTS");
export default {
  auth:false,
  async asyncData({ params,query, $axios }) {
    return {
      defaultSeList:DEFAULT_SELIST,
      searchType:"",
      seList:[],
      searchWords:"",
    }
  },
  computed:{
    loggedIn(){
      return this.$auth.$state.loggedIn;
    },
    user(){
      if(this.$auth.$state.loggedIn){
        return this.$auth.$state.user;
      }
      return null;

    },
  },
  async created(){
    this.seList = [];
    try{
      if(this.loggedIn){
        let rt = await this.$axios.get(`${API.INDEX_INIT}`);
        this.seList = rt.data.seList;
      }
    }catch(err){
      console.error(err)
    }
    if(!!!this.seList || this.seList.length == 0){
      for(let it of this.defaultSeList){
        this.seList.push(it);
      }
    }
    for(let it of this.seList){
      it.icoUrl = Utils.getFullDomainFromURL(it.addr) + "/favicon.ico";
      if(it.dft == "Y"){
        this.searchType = it.name;
      }
    }

    if(!!!this.searchType){
      this.searchType = this.seList[0].name;
    }
  },
  methods:{
    getSelectSearchType(){
      for(let it of this.seList){
        if(it.name === this.searchType){
          return it;
        }
      }
    },
    async userDropdownAction(item){
      switch(item){
        case "logout":
          this.logout();
          break;
        case "setting":
          window.open("/perSetting/account");
          break;
      }
    },
    async goSearch(){
      console.log(this.searchWords)
      let st = this.getSelectSearchType();
      if(!!st){
        let url = st.addr;
        url = url.replace("{key}",this.searchWords);
        window.open(url);
      }
    },
    async logout(){
      console.log("logout");
      console.log(this.$auth)
      this.$auth.logout();
    },
    addToFavorites() {
      alert("请使用Ctrl+D或Cmd+D手动添加收藏。");
    },
  }
}
</script>
