const appName = "vyoke.com" + ":" + process.env.NODE_ENV;
module.exports = {
  apps: [
    {
      name: appName,
      appTitle:"vyoke.com",
      script: 'build/main.js',
      watch: true,
      env: {
        NODE_ENV: 'development',
        PORT:5000,
        API_URL:"http://localhost:5000",
        JWT_KEY:"lalalal",
        JWT_TOKEN_EXPIRE: "2m", //3600(3600秒), '1h,30m,1d,1w,200s'
        JWT_REFRESH_TOKEN_EXPIRE: 3600 * 24 * 15, //2000(2000秒)
        USER_ACTIVE_LINK_EXPIRE: 7200,//激活邮件的链接失效时间
        MAIL_SENDER_USER:"xxxxxx@outlook.com",
        MAIL_SENDER_PASSWORD:"asdfsdfd213",
        SITE_ROOT:"http://localhost:5000",//网站域名
      },
      env_production: {
        NODE_ENV: 'production',
        PORT:5000,
        API_URL:"http://127.0.0.1:8081",
        SITE_ROOT:"http://www.vyoke.com",//网站域名
      }
    }
  ]
}
