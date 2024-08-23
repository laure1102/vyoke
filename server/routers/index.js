// router.js
const compose = require('koa-compose');


// 合并路由
const routes = compose([
  require('./routes/auth'),
  require('./routes/register'),
  require('./routes/forgetpass'),
  require('./routes/perSetting1'),
  require('./routes/perSetting2'),
  require('./routes/indexPage'),
  // 可以继续添加其他路由文件
]);

module.exports = routes;
