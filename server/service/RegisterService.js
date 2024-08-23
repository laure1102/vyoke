const {User} = require("../models");
const {randomSalt, encodePassword} = require("./utils/PasswordUtils");

const {sendMail} = require("./MailService");
const {Utils} = require("../../plugins/Utils");


const checkUsernameExists = async (username) =>{
  let user = await User.findOne({
    where:{
      username
    }
  });

  let rt =  !!user ? 1 : 0;
  if(!!user && user.active == 0){ //未激活
    rt = 2;
  }

  return rt;
}

const genUid = ()=>{
  let now = new Date();
  let str = now +"" + Utils.random(5);
  let uid = Utils.MD5(str);
  return uid;
}

const doRegister = async (user,
  identifyCodeId, identifyCode)=>{
    //验证码校验
    const {validationIdentifyCode} = require("./IdentifyCodeService");
    let idcRt = validationIdentifyCode(identifyCodeId, identifyCode);
    if (idcRt != 1){
      return idcRt;
    }
  //生成uid
  user.uid = genUid();
  let salt = randomSalt();
  let encryptPassword = encodePassword(user.password, salt);
  user.salt  = salt;
  user.password = encryptPassword;
  await user.save();
  sendActiveMail(user.username);
  return 1;
}

const resetPassword = async(username, newPass) =>{
  let user = await User.findOne({
    where:{
      username
    }
  });

  if(!!!user){
    return {
      code: -1,
      message: "用户不存在",
    }
  }

  let salt = randomSalt();
  let encryptPassword = encodePassword(newPass, salt);
  user.salt  = salt;
  user.password = encryptPassword;

  await user.save({fields:['salt','password']});
  return {code: 1}
}

const sentResetPasswordCodeMail = async (username, identifyCode) =>{
  let user = await User.findOne({
    where:{
      username
    }
  });

  //账户不存在或者已经激活
  if(!!!user){
    return;
  }

  let subject = "您正在修改vyoke的密码, 验证码为:";
  let body = "您正在修改vyoke的密码, 验证码为。<br>";
  body += `<strong>${identifyCode}</strong>`;

  sendMail(username, subject, body);
}

const sendActiveMail = async (username) =>{
  let user = await User.findOne({
    where:{
      username
    }
  });

  //账户不存在或者已经激活
  if(!!!user || user.active == 1){
    return;
  }

  let link = genActiveLink(username);
  let subject = "请激活您的vyoke账户";
  let body = "请点击下面的链接激活您的账户，如果不能点击请复制到浏览器中。<br>";
  body += `<a href='${link}' target='_blank'>${link}</a>`;

  sendMail(username, subject, body);
}

const genActiveLink = (username)=>{
  const APP_CFG = require("../../ecosystem.config.js").apps[0]
  let linkExpire = process.env.USER_ACTIVE_LINK_EXPIRE
   || APP_CFG.env.USER_ACTIVE_LINK_EXPIRE;
  let siteRoot = process.env.SITE_ROOT
   || APP_CFG.env.SITE_ROOT;
  let expireTime = new Date();
  expireTime = expireTime.setSeconds(expireTime.getSeconds() + linkExpire);
  let text = username + Utils.encryptSplitChars + expireTime;
  let key = username.length + "";
  let encrypted = Utils.encryptAes(text, key);
  encrypted = encodeURIComponent(encrypted + Utils.encryptSplitChars + key);
  let link = `${siteRoot}/activeUser/${encrypted}`;
  return link;
}

const doActiveUser = async (text) =>{
  let encrypted = decodeURIComponent(text);
  let arr = encrypted.split(Utils.encryptSplitChars);
  if(arr.length != 2){
    return "";
  }

  encrypted = arr[0];
  let key = arr[1];
  let decrypted = Utils.decryptAes(encrypted, key);
  arr = decrypted.split(Utils.encryptSplitChars);
  if(arr.length !=2){
    return "";
  }
  let username = arr[0];
  let expireTime = parseInt(arr[1]);
  if(new Date().getTime() > expireTime){
    return "_expired";
  }

  //更新数据库
  let user = await User.findOne({
    where:{
      username
    }
  });

  //账户不存在或者已经激活
  if(!!!user || user.active == 1){
    return "";
  }

  user.active = 1;
  await user.save({fields:['active']});
  return username;
}

module.exports = {
  doRegister,
  checkUsernameExists,
  sendActiveMail,
  doActiveUser,
  resetPassword,
  sentResetPasswordCodeMail,
}
