<template>
  <Menu :theme="theme2" :active-name="currentMenu">
    <MenuGroup title="账户安全">
        <MenuItem name="ps-account"
         to="/perSetting/account">基本信息</MenuItem>
        <MenuItem name="ps-changePswd"
         to="/perSetting/changePswd">密码修改</MenuItem>
        <MenuItem name="ps-bindEmail"
         to="/perSetting/bindEmail">绑定邮箱</MenuItem>
    </MenuGroup>
    <MenuGroup title="功能使用">
        <MenuItem name="ps-searchEngine"
         to="/perSetting/searchEngine">搜索引擎设置</MenuItem>
        <MenuItem name="2-2">流失用户</MenuItem>
    </MenuGroup>
  </Menu>
</template>

<script>
export default {
  name: "PersSettingMenu",

  data(){
    return {
        theme2: 'light'
    }
  },
  computed:{
    currentMenu(){
      return this.$store.state.PersSettingApp.currentMenu;
    },
  },
  mounted(){
  }
}
</script>

<style>
</style>
