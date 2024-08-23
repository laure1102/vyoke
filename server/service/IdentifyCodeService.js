const {Utils} = require("../../plugins/Utils");
const {MD5} = require("crypto-js");

const generateRandomNumber = (length) =>{
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10); // 生成0到9之间的随机整数
  }
  return parseInt(result, 10); // 将结果转换为整数并返回
}

const ENCRYPT_KEY = "real.laure.2023";
const EXPIRE_TIME = 120; /*有效期，120秒,2分钟*/

const genIdentifyCode = (length)=>{
  let code = "" + generateRandomNumber(length);
  //混入md5后的codeId
  let codeId = MD5(code+ENCRYPT_KEY).toString();
  let now = new Date();
  let expireTimeNum = now.setSeconds(now.getSeconds() + EXPIRE_TIME);
  let expireTime = expireTimeNum.toString(16);//转16进制
  let etLength = expireTime.length;
  codeId = codeId + "_" + etLength;
  codeId = expireTime + codeId;



  return {
    codeId,
    code
  }
}

const validationIdentifyCode = (identifyCodeId, identifyCode)=>{
  if(!!!identifyCode){
    return -3;
  }
  //解码
  let jCodeId = "";
  let arr = identifyCodeId.split("_");
  if(arr.length !=2){
    return -1;
  }
  try{
    jCodeId = arr[0];
    let eptLength = parseInt(arr[1]);
    let ept = parseInt(jCodeId.substring(0,eptLength),16);
    jCodeId = jCodeId.substring(eptLength,jCodeId.length);
    if(ept < new Date().getTime()){
      //验证码已过期
      return -2;
    }
    let p_codeId = MD5(identifyCode+ENCRYPT_KEY).toString();
    if(jCodeId === p_codeId){
      return 1;
    }
    return -1;
  }catch(error){
    console.log(error)
    return -1;
  }
  return -1;
}

const beautStatus = (idcRt) =>{
  if(idcRt == -3){
    return {
      code: -3,
      message: "验证码缺失",
    };
  }
  if(idcRt == -2){
    return {
      code: -3,
      message: "验证码过期",
    };
  }
  if(idcRt == -1){
    return {
      code: -3,
      message: "验证码错误",
    };
  }
  return null;
}

module.exports = {
  genIdentifyCode,
  validationIdentifyCode,
  beautStatus,
}
