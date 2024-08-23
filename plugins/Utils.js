const CryptoJS = require('crypto-js');
const {MD5} = require("crypto-js");

const Utils = {
  encryptAes(text, key){
    let encrypted = CryptoJS.AES.encrypt(text,
     key).toString();
    return encrypted;
  },

  decryptAes(encrypted, key){
    return CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
  },

  encryptSplitChars : "_/_",
  
  MD5(str){
    return MD5(str).toString();
  },
  random(length){
    return Math.floor(Math.random() * length) % length + 1;
  },
};

Utils.maskEmail = (email) =>{
   const parts = email.split('@');
    if (parts.length !== 2) {
      return email; // 邮箱格式不正确，返回原始值
    }
    
    const prefix = parts[0];
    const suffix = parts[1];
    
    if (prefix.length <= 2) {
      return email; // 如果前缀长度小于等于2，则保留前缀
    }
    
    const maskedPrefix = prefix[0] + '*'.repeat(prefix.length - 2) + prefix[prefix.length - 1];
    
    return maskedPrefix + '@' + suffix;
}

Utils.getDomainFromURL = (url) =>{
  try {
      const parsedURL = new URL(url);
      return parsedURL.hostname;
    } catch (error) {
      console.error('Invalid URL:', error.message);
      return null;
    }
}

Utils.getFullDomainFromURL = (url) =>{
  try {
      const parsedURL = new URL(url);
      return parsedURL.protocol + '//' + parsedURL.hostname;
    } catch (error) {
      console.error('Invalid URL:', error.message);
      return null;
    }
}

module.exports = {
  Utils,
}
