//koi-joi-router 数据校验
// https://github.com/koajs/joi-router
// joi校验规则： https://joi.dev/api/?v=17.9.1
// .required() 是不能等于undefined，就是不能缺这个字段
/** --config---
  validate: {
    header: joiObject,
    query: joiObject,
    params: joiObject,
    body: joiObject,
    maxBody: '64kb',
    output: { '400-600': { body: joiObject } },
    type: 'form',
    failure: 400,
    continueOnError: false
  },
  pre: async (ctx, next) => {
    await checkAuth(ctx);
    return next();
  },
 */

const Joi = require('joi');
const JoiRouter = require('koa-joi-router');

const newValidateRule = (rule) =>{
  //忽略掉多余的字段
  return Joi.object(rule).options({allowUnknown: true});
}


module.exports = {
  JoiRouter,
  Joi,
  newValidateRule,
}
