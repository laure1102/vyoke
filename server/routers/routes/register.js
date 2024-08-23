const {Joi,JoiRouter,newValidateRule} = require('../baseRouter');
const router = new JoiRouter();

const {API} = require("../../../common/API_CONST");
const {doRegister, checkUsernameExists,
 sendActiveMail, doActiveUser} = require("../../service/RegisterService");

const {User} = require("../../models");
const {apiLR} = require("../../middleware/apiLR");

const regFormVRule = newValidateRule({
  username: Joi.string().email().min(1).required(),
  password: Joi.string().min(8).required(),
  nickname: Joi.string().min(1).required(),
  identifyCodeId: Joi.string().min(1).required(),
  identifyCode: Joi.string().min(1).required(),
});

//用户名检查
router.get(`${API.REGISTER_CHECK_USERNAME_EXIST}/:username`,async (ctx, next) => {
    let {username} = ctx.request.params;
    let rt = await checkUsernameExists(username);
    return (ctx.body = rt)
});

//注册
router.post(`${API.REGISTER_DO_REG}`,{
    pre: async (ctx, next)=>{
      const { username} = ctx.request.body;
      let rt = await checkUsernameExists(username);
      if(rt == 0){
        await next();
      }else{
        ctx.status = 400;
        ctx.body = "用户名已经存在.";
        return ;
      }
    },
    validate: {
        body: regFormVRule,
        type: 'json',
      },
  },async (ctx, next) => {
    const { username, password,nickname,email,
        identifyCodeId, identifyCode } = ctx.request.body
    let user = User.build({
      username,
      password,
      nickname,
      email,
    });
    let rt = await doRegister(user,
      identifyCodeId, identifyCode);
    const {beautStatus} = require("../../service/IdentifyCodeService");
    let idRt = beautStatus(rt);
    if(!!idRt){
      ctx.body = idRt;
      return;
    }

    ctx.body = {code:rt};
    return;
});

//发送激活邮件
router.get(`${API.REGISTER_SEND_ACTIVE}/:username`,async (ctx, next) => {
    let {username} = ctx.request.params;
    sendActiveMail(username);
    return (ctx.body = {data:1})
});

//处理激活
router.get(`${API.ACTIVE_USER}/:text`,async (ctx, next) => {
    let {text} = ctx.request.params;
    let username = await doActiveUser(text);
    if(!!username){
      if(username === "_expired"){
        ctx.body = "链接已失效，请登录时重新发送。"
        return;
      }

      const {Utils} = require('../../../plugins/Utils');
      let encrypted = Utils.encryptAes(username, username.length + "");
       encrypted = encodeURIComponent(encrypted +
        Utils.encryptSplitChars+ username.length);

      ctx.redirect(`/reg_success/${encrypted}`);
    }else{
      ctx.body = "发生错误了。"
      return;
    }
});

module.exports = router.middleware();
