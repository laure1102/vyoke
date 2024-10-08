import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'
import koaStatic from 'koa-static'
import koaBody from 'koa-better-body'
import path from 'path'
import routes from './routers'

import {errorHandler} from './middleware/globalErrorHandler';
import {getUserHandler} from './middleware/getUserHandler';

const app = new Koa();
require('koa-qs')(app, 'extended');
const APP_CFG = require("../ecosystem.config.js").apps[0]

async function start() {
  const host = process.env.HOST || APP_CFG.env.HOST||'0.0.0.0'
  const port = process.env.PORT || APP_CFG.env.PORT||"3000";
  // 配置静态资源加载中间件
  app.use(koaStatic(path.join(__dirname, './src')))

  app.use(koaBody({
    fields:"body", //解析后的数据挂载在 ctx.request.body 上
    multipart: true
  }))
  //登录信息获取
  app.use(getUserHandler);

  // 错误处理中间件
  app.use(errorHandler);


  // 处理路由
  app.use(routes);


  // Import and Set Nuxt.js options
  let config = require('../nuxt.config.js')
  // 由于涉及到三个环境变化，使用在test，production 时候，为false
  config.dev = !(app.env === 'production' || app.env === 'test' || app.env === 'pre')
  // console.log('env === ', app.env, env, process.env.COOKIE_DOMAIN, process.env.APP_ENV, config.dev)

  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(async (ctx, next) => {
    await next()
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset
    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })

  app.listen(port, host)
  console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
}

start();
