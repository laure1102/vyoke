const {Joi,JoiRouter,newValidateRule} = require('../baseRouter');

const router = new JoiRouter();

const {apiLR} = require("../../middleware/apiLR");

const {API} = require("../../../common/API_CONST");
const {genIdentifyCode,
  validationIdentifyCode,beautStatus} = require("../../service/IdentifyCodeService");
  const {checkUsernameExists,sentResetPasswordCodeMail} = require("../../service/RegisterService");
  
//第一步，验证邮箱和验证码
router.post(`${API.FORGET_PASS_1}`,  async (ctx, next) => {
  const {username,
          identifyCodeId, identifyCode} = ctx.request.body;
  
  //验证码
  let idRt = validationIdentifyCode(identifyCodeId, identifyCode);
  let rt = beautStatus(idRt);
  if(!!rt){
    ctx.body = rt;
    return;
  }

  let exists = await checkUsernameExists(username);
  if(exists < 1){
    ctx.body = {
      code: -1,
      message: "用户不存在",
    };
    return;
  }

  //发送验证码到邮箱
  let idtf = genIdentifyCode(4);
  sentResetPasswordCodeMail(username, idtf.code);

  return (ctx.body = {
      code : 1,
      idtf: idtf.codeId,
    })
});


//发送验证码
router.post(`${API.FORGET_PASS_SEND_CODE}`,  async (ctx, next) => {
  const {username} = ctx.request.body;
//发送验证码到邮箱
  let idtf = genIdentifyCode(4);
  sentResetPasswordCodeMail(username, idtf.code);

  return (ctx.body = {
      code : 1,
      idtf: idtf.codeId,
    })

});

//第2步，重置密码
router.post(`${API.FORGET_PASS_2}`,  async (ctx, next) => {
  const {username,password} = ctx.request.body;

  const {resetPassword} = require("../../service/RegisterService");

  let rt = resetPassword(username,password);


  return (ctx.body = rt)
});


module.exports = router.middleware();
