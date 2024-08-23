const API ={
  REGISTER_DO_REG:"/api/register",
  REGISTER_CHECK_USERNAME_EXIST:"/api/checkUserExist",
  REGISTER_SEND_ACTIVE:"/api/sendActive",
  ACTIVE_USER:"/activeUser",
  IDENTIFY_CODE: "/api/refreshIdentifyCode",
  LOGIN_AUTH: '/api/auth',
  LOGIN_LOGOUT: "/api/logout",
  LOGIN_FETCH_USER_INFO: "/api/fetchUserResources",
  LOGIN_REFRESH_TOKEN: "/api/refreshToken",

  FORGET_PASS_1: "/api/forgetpass1",
  FORGET_PASS_2: "/api/forgetpass2",
  FORGET_PASS_SEND_CODE: "/api/forgetpass/sendCode",
  PERSETTING_ACCOUNT: "/api/perSetting/account",
  PERSETTING_CHANGEPSWD: "/api/perSetting/changePswd",
  PERSETTING_BINDEMAIL: "/api/perSetting/bindEmail",
  PERSETTING_BINDEMAIL_SENDCODE: "/api/perSetting/bindEmail/sendCode",
  PERSETTING_SEARCHENGINE: "/api/perSetting/searchEngine",

  INDEX_INIT:"/api/index/init",

}

module.exports = {
  API
}
