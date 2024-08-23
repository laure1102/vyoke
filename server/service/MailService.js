const APP_CFG = require("../../ecosystem.config.js").apps[0]
const emailer = require('nodemailer');

// 配置Nodemailer
let user = process.env.MAIL_SENDER_USER || APP_CFG.env.MAIL_SENDER_USER;
let pass = process.env.MAIL_SENDER_PASSWORD || APP_CFG.env.MAIL_SENDER_PASSWORD;
const transporter = emailer.createTransport({
  service: 'Outlook', // 使用Outlook服务
  auth: {
    user, // 你的Outlook邮箱地址
    pass, // 你的Outlook应用程序密码
  },
});


const sendMail = async (to, subject, body) =>{
  try{
    const mailOptions = {
      from: user, // 发件人
      to: to, // 收件人
      subject: subject, // 邮件主题
      html: body, // 邮件正文
    };

    // 使用Nodemailer发送邮件
    const info = await transporter.sendMail(mailOptions);
    console.log('邮件发送成功：', info.messageId);
    return 1;
  }catch(error){
    console.error('邮件发送失败：', error);
    return 0;
  }
}


module.exports = {
  sendMail
}
