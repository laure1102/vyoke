const {Joi,JoiRouter,newValidateRule} = require('../baseRouter');

const router = new JoiRouter();

const {apiLR} = require("../../middleware/apiLR");
const {API} = require("../../../common/API_CONST");

const {
  getMySearchEngine,
 } = require("../../service/PerSetting2Service");
//--搜索引擎设置--

router.get(`${API.INDEX_INIT}`,async (ctx, next) => {
  let uid = ctx.request.uid;
  let seList = [];
  if(!!uid){
    seList = await getMySearchEngine(uid);
  }
  
  ctx.body = {
    seList,
  };
  return ;
});

module.exports = router.middleware();
