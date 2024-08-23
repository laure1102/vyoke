const {User,UserObj, RefreshToken} = require("../models");
const {encodePassword} = require("./utils/PasswordUtils");
const APP_CFG = require("../../ecosystem.config.js").apps[0]
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const {sendActiveMail} = require("./RegisterService");

//登录
const doLogin = async (username, password,
                      identifyCodeId, identifyCode)=>{
  //验证码校验
  const {validationIdentifyCode,beautStatus} = require("./IdentifyCodeService");
  let idcRt = validationIdentifyCode(identifyCodeId, identifyCode);
  let rt = beautStatus(idcRt);
  if(!!rt){
    return rt;
  }

  let user = await User.findOne({
    where:{
      username
    }
  });

  if(!!!user || //用户不存在
    user.password !==encodePassword(password, user.salt) ||
    user.deleted > 0 //用户被删除
  ){
      return {
        code: -1,
        message: "用户名或密码错误",
      };
  }

  if(user.active != 1){//未激活
    sendActiveMail(user.username);
    return {
      code: -2,
      message: "用户未激活",
    };
  }

  return {
    code: 1,
    message: "登录成功",
  };
}

//生成token和refresh_token
const genTokensAfterLogin = async (username)=>{
  let JWT_KEY = process.env.JWT_KEY || APP_CFG.env.JWT_KEY;
  let JWT_TOKEN_EXPIRE = process.env.JWT_TOKEN_EXPIRE
   || APP_CFG.env.JWT_TOKEN_EXPIRE;
  let JWT_REFRESH_TOKEN_EXPIRE = process.env.JWT_REFRESH_TOKEN_EXPIRE
   || APP_CFG.env.JWT_REFRESH_TOKEN_EXPIRE;

   let user = await User.findOne({
     where:{
       username
     }
   });

   let info = {
     uid: user.uid,
     username,
   };
  // 生成 JWT
  const token = jwt.sign(info, JWT_KEY, { expiresIn: JWT_TOKEN_EXPIRE });

  const refresh_token = uuidv4();
  const curentDate = new Date();
  let expireAt = curentDate.setSeconds(
  curentDate.getSeconds() + JWT_REFRESH_TOKEN_EXPIRE);
  let retken = await RefreshToken.create({
    refreshToken:refresh_token,
    uid: user.uid,
    expireAt,
  });

  return {
    code : 1,
    token,
    refresh_token,
  };
}

const getUserInfo = async (username)=>{
  if(!!username){
    let u = await UserObj.findOne({
      where: {
        username: username
      }
    });
    return u;
  }

  return null;
}

const doRefreshToken = async (refreshToken)=>{
  let JWT_KEY = process.env.JWT_KEY || APP_CFG.env.JWT_KEY;
  let JWT_TOKEN_EXPIRE = process.env.JWT_TOKEN_EXPIRE
   || APP_CFG.env.JWT_TOKEN_EXPIRE;
  if(!!refreshToken){
    let rto = await RefreshToken.findOne({
      where: {
        refreshToken: refreshToken
      }
    });
    if(!!rto){
      let now = new Date();
      if(now.getTime() < rto.expireAt.getTime()){
        let user = await User.findOne({
          where:{
            uid: rto.uid,
          }
        });
        let info = {
           uid: rto.uid,
           username: user.username,
         };
        // 生成 JWT
        const token = jwt.sign(info, JWT_KEY, { expiresIn: JWT_TOKEN_EXPIRE });
        return token;
      }
    }
  }

  return "";
}

module.exports = {
  doLogin,
  genTokensAfterLogin,
  getUserInfo,
  doRefreshToken,
}
