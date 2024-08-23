const {User,UserObj, UserInfo,} = require("../models");
const {randomSalt, encodePassword} = require("./utils/PasswordUtils");
const {genIdentifyCode,
  validationIdentifyCode,beautStatus} = require("./IdentifyCodeService");
const {sendMail} = require("./MailService");

const getUserInfoToSetting = async (uid) =>{
  let u = await UserObj.findOne({
    where: {
      uid: uid
    }
  });

  let uinfo = await UserInfo.findOne({
    where: {
      uid: uid,
    }
  });

  if(!!!uinfo){
    uinfo = UserInfo.build();
    uinfo.uid = uid;
  }

  return {
    user:u,
    info:uinfo,
  }
}


const saveUserInfoToSetting = async (uid,info) =>{

  let uinfoDB = await UserInfo.findOne({
    where: {
      uid: uid
    }
  });

  info.uid = uid;
  if(!!uinfoDB){
    info.id = uinfoDB.id;
    let rt = await UserInfo.update(info,
    {
      where:{id:info.id}
    });
    return info;
  }else{
    let uinfo = await UserInfo.create(info);
    return uinfo;
  }

  return {
    user:u,
    info:uinfo,
  }
}

const changePswd = async(uid, oldPassword, password) =>{
  let user = await User.findOne({
      where:{
        uid
      }
    });

    if(!!!user || //用户不存在
      user.password !==encodePassword(oldPassword, user.salt) ||
      user.deleted > 0 //用户被删除
    ){
        return {
          code: -1,
          message: "旧密码错误",
        };
    }

    let salt = randomSalt();
    let encryptPassword = encodePassword(password, salt);
    user.salt  = salt;
    user.password = encryptPassword;

    await user.save({fields:['salt','password']});
    return {code: 1}
}

const sendCodeBindEmail = async (uid,oldEmail, password, newEmail) =>{
  let user = await User.findOne({
      where:{
        uid
      }
    });
  let username = user.username;
  if(oldEmail !== username){
    return {
      code: -1,
      message:"当前登录邮箱输入错误",
    }
  }

    if(!!!user || //用户不存在
      user.password !==encodePassword(password, user.salt) ||
      user.deleted > 0 //用户被删除
    ){
        return {
          code: -1,
          message: "登录密码错误",
        };
    }
  let idtf = genIdentifyCode(4);
  let identifyCode = idtf.code;
  let subject = "您正在修改vyoke的绑定邮箱, 验证码为:";
  let body = "您正在修改vyoke的绑定邮箱, 验证码为。<br>";
  body += `<strong>${identifyCode}</strong>`;

  sendMail(newEmail, subject, body);
  return {
    code: 1,
    identifyCodeId: idtf.codeId,
  }
}

const bindNewEmail =
 async (uid, identifyCodeId, identifyCode,newMail) =>{
   let user = await User.findOne({
       where:{
         uid
       }
     });

  if(!!!user){
    return {
          code: -1,
          message: "用户不存在",
        };
  }

  let rt = validationIdentifyCode(identifyCodeId, identifyCode);
  if(rt!=1){
    return beautStatus(rt);
  }

  await User.update(
  {username:newMail},
  {where:{
    id:user.id
  }});

  return {code: 1}
}

module.exports = {
  getUserInfoToSetting,
  saveUserInfoToSetting,
  changePswd,
  sendCodeBindEmail,
  bindNewEmail,
}
