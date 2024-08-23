//API必须登录
const apiLR = async (ctx, next) => {
  if(!!ctx.request.username){
      await next();
  }else{
    ctx.status = 403;
    ctx.body = "login is required.";
    return;
  }
}


module.exports = {
  apiLR,
}
