const {Joi,JoiRouter,newValidateRule} = require('../baseRouter');

const router = new JoiRouter();

const {apiLR} = require("../../middleware/apiLR");

const {
  doLogin,getUserInfo,
 genTokensAfterLogin,doRefreshToken
 } = require("../../service/LoginService");

const {API} = require("../../../common/API_CONST");

//获取用户信息
router.get(`${API.LOGIN_FETCH_USER_INFO}`,apiLR, async (ctx, next) => {
  let username = ctx.request.username;
  let data = await getUserInfo(username);
  ctx.body = {data};
  return ;
});

//刷新token
router.post(`${API.LOGIN_REFRESH_TOKEN}`,  async (ctx, next) => {
  const {refresh_token} = ctx.request.body;
  let token = await doRefreshToken(refresh_token);

  return (ctx.body = {
      token : token
    })
});

//登陆验证
router.post(`${API.LOGIN_AUTH}`, async (ctx, next) => {
  const { username, password,
          identifyCodeId, identifyCode } = ctx.request.body
  let {code, message} = await doLogin(username, password,
  identifyCodeId, identifyCode
  );

  // 登录不成功
  if (code != 1) {
    return (ctx.body = {
      code,
      message
    })
  }

  // 登陆成功
  // 生成token和refresh_token
  let rt = await genTokensAfterLogin(username);
  return (ctx.body = rt)
});

//退出
router.get(`${API.LOGIN_LOGOUT}`, async (ctx, next) => {
    return (ctx.body = {
        msg: '退出成功',
    })
});


//获取验证码
router.get(`${API.IDENTIFY_CODE}`, async (ctx, next) => {
  const {genIdentifyCode} = require("../../service/IdentifyCodeService");
  let rt = genIdentifyCode(4);
  return (ctx.body = rt)
});

module.exports = router.middleware();
