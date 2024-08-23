<template>
  <div id="container">
    <Row class="per-setting-layout-header">
      <Col span="20">
        <div>
          <img src="@/assets/images/logo.png">
          <div class="per-setting-layout-logo-txt">vyoke.com</div>
        </div>
      </Col>
      <Col span="4">
        <div class="per-setting-layout-username">
          {{user.nickname}}
        </div>
      </Col>
    </Row>
    <Row>
        <Col span="4">
          <PersSettingMenu/>
        </Col>
        <Col span="20">
          <div class="right-container">
            <nuxt/>
          </div>
        </Col>
    </Row>

  </div>
</template>

<script>
import PersSettingMenu from "@/components/menus/PersSettingMenu"
export default {
  components:{PersSettingMenu,},

  computed:{
    user(){
      if(this.$auth.$state.loggedIn){
        return this.$auth.$state.user;
      }
      return null;

    },
  },
  mounted(){
  }
}
</script>

<style>
  .per-setting-layout-header{
    background: #f7f5f5;
    height: 64px;
    line-height: 64px;
  }
  .per-setting-layout-header img{
    height:59px;
    margin-left: 2px;
    float:left;
  }
  .per-setting-layout-logo-txt{
    float:left;
    margin-left: 2px;
    font-size: 22px;
    font-weight: bold;
  }
  .per-setting-layout-username{
    float:right;
    font-size: 16px;
    margin-right: 5px;
  }
  .right-container{
    padding-left:30px;
    padding-top:10px;
    padding-right:30%;
  }
  .perSetting-h2{
    font-size: 20px;
  }
</style>
