const APP_CFG = require("./ecosystem.config.js").apps[0]
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: APP_CFG.appTitle,
    meta: [{
        charset: 'utf-8'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'vyoke'
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: 'vyoke'
      },
      {
        hid: 'viewport',
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0'
      }

    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
      { rel: 'stylesheet', name: 'theme', href: '' }
    ],
    script: [
    ]
  },
  css: [
    { src: "view-design/dist/styles/iview.css" },
    { src: "~assets/css/main.css" },

  ],
  plugins: [
    '@/plugins/axios',
    { src: "~plugins/iview.js", ssr: true },
  ],
  env: {
    NODE_ENV: process.env.NODE_ENV
  },
  cache: {
    max: 1000,
    maxAge: 900000
  },
  router: {
    middleware: [
      // 在每页渲染前运行 middleware/route.js 中间件的逻辑
      'auth',
    ]
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    "@nuxtjs/axios",
    '@nuxtjs/auth-next'
  ],
  auth:{
    //Options
    strategies: {
      vyoke: {
        scheme: 'refresh',
        token: {
          property: "token",
          name: "token",//自动在axios的headers里增加属性
          required: true,
          // maxAge: 1800,
          type: ""
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          // maxAge: 60 * 60 * 24 * 30
        },
        user: {
          property: 'data',
          // autoFetch: true
        },
        endpoints: {
          login: {
            url: '/api/auth',
            method: 'post'
          },
          logout: {
            url: '/api/logout',
            method: 'get'
          },
          refresh: { url: '/api/refreshToken', method: 'post' },
          user: {
            url: '/api/fetchUserResources',
            method: 'get',
            propertyName: false
          }
        }
      },
    },
    redirect: {
      login: '/login',
      logout: '/logout',
      callback: '/login',
      home: '/'
    },
    cookie: {
      options: {
        maxAge: 60 * 60 * 24 * 15
      }
    },
    localStorage: false,
  },
  /*
   ** axios proxy  */
  axios: {
    baseURL: process.env.API_URL || APP_CFG.env.API_URL,
    proxy: false,
    debug: false
  },

  /*
   ** proxy
  proxy: {
    "/api": {
      target: process.env.API_URL || APP_CFG.env.API_URL
    },
  },
   */
  build: {
    vendor: ['axios'],
    extend(config, ctx) {
      if (ctx.isClient) {
        // config.module.rules.push({
        //   enforce: 'pre',
        //   test: /\.(js|vue)$/,
        //   loader: 'eslint-loader',
        //   exclude: /(node_modules)/
        // })
      }
    }
  }
}
