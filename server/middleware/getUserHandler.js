const Joi = require('joi');
const APP_CFG = require("../../ecosystem.config.js").apps[0]
const jwt = require('jsonwebtoken');

const getUserHandler = async (ctx, next) => {
  let JWT_KEY = process.env.JWT_KEY || APP_CFG.env.JWT_KEY;
  if(!!ctx.request.headers.token){
    try{
      const decoded = jwt.verify(ctx.request.headers.token, JWT_KEY);
      let {uid,username} = decoded;
      ctx.request.username = username;
      ctx.request.uid = uid;
      await next();
      return;
    }catch(err){
    }
  }
  ctx.request.username = "";
  ctx.request.uid = "";
  await next();
  }


module.exports = {
  getUserHandler,
}
