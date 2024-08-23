
const {MD5} = require("crypto-js");

const random = (length) =>{
  return Math.floor(Math.random() * length) % length + 1;
}

const randomSalt = ()=>{
  let salt = "";
  let tables = ["a", "0", "c", "2", "d", "4", "e", "9", "n", "7"];
  let length = random(5);
  for (let i = 0; i < length; i++) {
  			salt += tables[random(10) - 1];
  }
  return salt;
}

const encodePassword = (password, salt) => {
    let encodePassword = password;
    let times;

    if (salt === null || salt.length < 1) {
        encodePassword = MD5(encodePassword).toString();
        return encodePassword;
    } else {
        times = salt.length;
        for (let i = 0; i < times; i++) {
            let saltPassword = salt.charAt(i) + encodePassword + salt.charAt(i);
            encodePassword = MD5(saltPassword).toString();
        }
        return encodePassword;
    }
}

module.exports = {
  randomSalt,
  encodePassword,
}
