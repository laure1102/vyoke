
const errorHandler = async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      if (error.name == "ValidationError") {
        ctx.status = 400;
        ctx.body = error.message;
      }else{
        console.log(error)
        ctx.status = 500; // 设置状态码为 500 Internal Server Error
        ctx.body = {error: error};
      }
    }
}


module.exports = {
  errorHandler,
}
