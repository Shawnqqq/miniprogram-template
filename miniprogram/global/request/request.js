import API from "./api.js";

const globalError = response => {
  wx.showModal({
    title: String(response.status_code),
    content: response.message,
    confirmText: "确定",
    showCancel: false
  });
};

const showError = (error_code, message, successCallback) => {
  wx.showModal({
    title: String(error_code),
    content: message,
    confirmText: "确定",
    showCancel: false,
    success: res => {
      successCallback &&
        typeof successCallback === "function" &&
        successCallback();
    }
  });
};

const interceptorsRequest = (method, url, data, header = {}) => {
  let params = { method, url, data, header };
  let userInfoKey = `${API.MODE}_userInfo`;
  let storageUserInfo = wx.getStorageSync(userInfoKey);
  if (storageUserInfo) {
    header["Authorization"] = `Bearer ${storageUserInfo.token}`;
  }
  return params;
};

const request = (method, url, data, header) => {
  let params = interceptorsRequest(method, url, data, header);
  return new Promise((resolve, reject) => {
    wx.request({
      method,
      url: params.url,
      header: params.header,
      data: params.data,
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.error_code) {
            let message = res.data.msg || res.data.message;
            showError("提示", message);
            reject(res.data);
          } else {
            if (res.data.data) {
              resolve(res.data.data);
            } else {
              resolve(res.data);
            }
          }
        } else if (res.statusCode === 401) {
          //登录过期过期逻辑
          showError("登录过期", "请重新登录", () => {
            wx.reLaunch({ url: "/pages/index/index" });
          });
          wx.clearStorageSync();
          reject(res.data);
        } else {
          wx.clearStorageSync();
          reject(res.data.message);
          globalError("500");
        }
      },
      fail: err => {
        wx.showModal({
          title: "网络",
          content: "网络出现问题，请检查网络是否连接畅通！",
          confirmText: "确定",
          showCancel: false
        });
        reject(err);
      }
    });
  });
};

/* [请求库]
 ** @params url         { string }   @default => '' [接口地址，统一在 api 文件中]
 ** @params data/params { object }   @default => {} [发送数据]
 ** @params header      { object }   @default => {} [请求 Header 配置]
 */

export default {
  post: function(url = "", data = {}, header = {}) {
    return request("POST", url, data, header);
  },
  put: function(url = "", data = {}, header = {}) {
    return request("PUT", url, data, header);
  },
  get: function(url, data = {}, header = {}) {
    return request("GET", url, data, header);
  },
  delete: function(url = "", data = {}, header = {}) {
    return request("DELETE", url, header);
  }
};
