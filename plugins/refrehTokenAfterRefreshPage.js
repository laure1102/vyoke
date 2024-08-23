// nuxt.config.js
// 
    // '@/plugins/refrehTokenAfterRefreshPage',
    
    
// const jwt = require('jsonwebtoken');

// function getExpirationDate(token) {
//   try {
//     const decodedToken = jwt.decode(token);
//     if (decodedToken && decodedToken.exp) {
//       return new Date(decodedToken.exp * 1000); // 过期时间是以秒为单位的，需要转换为毫秒
//     }
//   } catch (error) {
//     console.error('Failed to decode token:', error);
//   }
//   return null;
// }


export default ({ app }) => {
  // 在页面刷新时，执行 Token 刷新逻辑
  if (process.client) {
    window.onNuxtReady(() => {
      let refreshTokenStatus = app.$auth.strategy.refreshToken.status();
      let tokenStatus = app.$auth.strategy.token.status();

      if(refreshTokenStatus === "valid" && tokenStatus !== "valid"){
        console.log("after refresh page,token expired, to refresh token...");
        app.$auth.refreshTokens();
      }
    });
  }
};
