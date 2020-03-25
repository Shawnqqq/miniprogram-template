import promise from "./libs/promise.js";
import myService from './global/service/my.js'

App({
  onLaunch: function () {
    promise();
    // 展示本地存储能力
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    if (token && userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.token = token;
      return
    }

  },
  login: function (params) {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          if (res.code) {
            params.code = res.code;
            myService.login(params).then(res=>{
              wx.setStorageSync('userInfo', res);
              wx.setStorageSync('token', res.token);
              this.globalData.userInfo = res;
              this.globalData.token = res.token;
              resolve('success')
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    })
  },
  globalData: {
    userInfo: null,
    token: null
  }
})