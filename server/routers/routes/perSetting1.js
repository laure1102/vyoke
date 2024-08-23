const {Joi,JoiRouter,newValidateRule} = require('../baseRouter');

const router = new JoiRouter();

const {apiLR} = require("../../middleware/apiLR");

const {
  getUserInfoToSetting,
  saveUserInfoToSetting,
  changePswd,
  sendCodeBindEmail,
  bindNewEmail,
 } = require("../../service/PerSetting1Service");

const {API} = require("../../../common/API_CONST");

const baseInfoFormVRule = newValidateRule({
  intro: Joi.string().max(200).required().allow(""),
});

//获取用户基本信息
router.get(`${API.PERSETTING_ACCOUNT}`,apiLR,
 async (ctx, next) => {
  let uid = ctx.request.uid;
  let data = await getUserInfoToSetting(uid);
  ctx.body = data;
  return ;
});


//保存用户基本信息
router.post(`${API.PERSETTING_ACCOUNT}`,{
    validate: {
        body: baseInfoFormVRule,
        type: 'json',
      },
  },apiLR,
 async (ctx, next) => {
  let uid = ctx.request.uid;
  let info = ctx.request.body;

  let data = await saveUserInfoToSetting(uid, info);
  ctx.body = data;
  return ;
});

const changePswdFormVRule = newValidateRule({
  oldPassword: Joi.string().required(),
  password: Joi.string().min(8).required(),
});
//修改密码
router.post(`${API.PERSETTING_CHANGEPSWD}`,{
    validate: {
        body: changePswdFormVRule,
        type: 'json',
      },
  },apiLR,
 async (ctx, next) => {
  let uid = ctx.request.uid;
  let {oldPassword,password} = ctx.request.body;

  let data = await changePswd(uid,oldPassword, password);
  ctx.body = data;
  return ;
});


//绑定邮箱

const newEmailFormVRule = newValidateRule({
  identifyCodeId: Joi.string().required(),
  identifyCode: Joi.string().required(),
  newEmail: Joi.string().email().required(),
});

router.post(`${API.PERSETTING_BINDEMAIL}`,{
    validate: {
        body: newEmailFormVRule,
        type: 'json',
      },
  },apiLR,
 async (ctx, next) => {
  let uid = ctx.request.uid;
  let {identifyCodeId, identifyCode,newEmail} = ctx.request.body;
  let data = await bindNewEmail(uid,identifyCodeId, identifyCode,newEmail);
  ctx.body = data;
  return ;
});


const sendCodeFormVRule = newValidateRule({
  oldEmail: Joi.string().email().required(),
  password: Joi.string().required(),
  newEmail: Joi.string().email().required(),
});
router.post(`${API.PERSETTING_BINDEMAIL_SENDCODE}`,{
    validate: {
        body: sendCodeFormVRule,
        type: 'json',
      },
  },apiLR,
 async (ctx, next) => {
  let uid = ctx.request.uid;
  let {oldEmail, password, newEmail} = ctx.request.body;
  let data = await sendCodeBindEmail(uid,oldEmail, password, newEmail);

  ctx.body = data;
  return ;
});

module.exports = router.middleware();
