import Cookies from 'js-cookie'
import { Message } from 'view-design'
export function getToken() {
  let loginType = Cookies.get("auth.strategy");
  return Cookies.get("auth._token." + loginType);
}


export default function({ $axios, store }) {
    // request interceptor
    $axios.interceptors.request.use(
      config => {
        // 自定义header信息（比如token）
        if(!config.headers['token']){
          let token = getToken();
          if(!!token){
            config.headers['token'] = token;
          }
        }
        return config;
      },
      error => {
        // 对请求错误做些什么
        return Promise.reject(error)
      }
    )
    $axios.onRequest(config => {
    })

    // response interceptor
    /**/
    $axios.interceptors.response.use(
        res => {
          return res
        },
        err => {
          if(!err.response || !err.response.status){
            if (process.client) {
              Message.error('服务器已断开，请稍后再试。')
            }else{
              console.log('服务器已断开，请稍后再试。');
            }
          }
          if (!!err.response) {
            switch(err.response.status){
              case 200:
                break;
              case 400:
                if (process.client) {
                  Message.error(err.response.data)
                }else{
                  console.log(err.response.data);
                }
                break;
              case 403:
                if (process.client) {
                  Message.error(err.response.data)
                }else{
                  console.log(err.response.data);
                }
                break;
              case 500:
                if (process.client) {
                  Message.error("服务器端发生错误")
                }else{
                  console.log("服务器端发生错误:" + err.response.data);
                }
                break;
              default:
                if (process.client) {
                  Message.error(err.response.data)
                }else{
                  console.log(err.response.data);
                }
            }
          }
          return Promise.resolve(err)
        }
    )
  }
