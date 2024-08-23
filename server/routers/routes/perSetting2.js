const {Joi,JoiRouter,newValidateRule} = require('../baseRouter');

const router = new JoiRouter();

const {apiLR} = require("../../middleware/apiLR");

const {
  getMySearchEngine,
  saveMySearchEngine,
 } = require("../../service/PerSetting2Service");

const {API} = require("../../../common/API_CONST");

const baseInfoFormVRule = newValidateRule({
  intro: Joi.string().max(200).required().allow(""),
});

//--搜索引擎设置--

router.get(`${API.PERSETTING_SEARCHENGINE}`,apiLR,
 async (ctx, next) => {
  let uid = ctx.request.uid;
  let data = await getMySearchEngine(uid);
  ctx.body = data;
  return ;
});

router.post(`${API.PERSETTING_SEARCHENGINE}`,apiLR,
 async (ctx, next) => {
  let uid = ctx.request.uid;
  let {list} = ctx.request.body;

  let data = await saveMySearchEngine(uid, list);
  ctx.body = data;
  return ;
});

module.exports = router.middleware();
