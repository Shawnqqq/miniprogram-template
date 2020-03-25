// eslint-disable-next-line
const regeneratorRuntime = require("../../libs/runtime");
import request from "./../request/request.js";
import API from "./../request/api.js";

export default {
  /*
   ** upload(params, progressHandle)
   **
   ** @params platform        {string}       平台
   ** @params scene           {string}       场景
   ** @params space           {string}       空间
   ** @params folder          {string}       文件夹
   ** @params title           {string}       文件自定义名称
   ** @params progressHandle  {function}   上传事件回调
   ** @params fileName        {string}
   ** @params filePath        {string}
   */
  async upload(
    { platform, scene, bucket, space, fileName, filePath, folder, title },
    progressHandle
  ) {
    try {
      // 获取平台
      const config = await this.config({
        platform: platform || "vip_default",
        scene: scene || "vip_public",
        space,
        folder
      });
      // 七牛平台
      if (config.driver === "qiniu") {
        const targetBucket = bucket || config.bucket || "";
        // 获取 token
        const tokenInfo = await this.fetchQiNiuToken({
          fileName,
          bucket: targetBucket,
          space: space || "default",
          folder: folder || "default"
        });
        // 上传七牛
        const qiniuRes = await this.uploadFileToQiNiu(
          {
            key: tokenInfo.key,
            token: tokenInfo.token,
            filePath,
            space: space
          },
          progressHandle
        );
        const qiniuResData = JSON.parse(qiniuRes);
        // 上报信息
        return await this.sendQiNiuRes({
          bucket: targetBucket,
          path: tokenInfo.key,
          name: qiniuResData.fname,
          title: title || "",
          space: space
        });
      } else {
        const error = new Error("本地上传没写");
        return Promise.reject(error);
      }
    } catch (e) {
      const error = new Error("上传失败");
      return Promise.reject(error);
      // throw e;
    }
  },
  /* 获取平台类型
   ** @params platform        {string}       平台
   ** @params scene           {string}       场景
   */
  config({ platform, scene, space, folder }) {
    // eslint-disable-next-line
    return request.get(API.qiniuConfig,
      { platform, scene, space, folder });
  },
  /* 获取七牛的token和key
   ** @params bucket           {string}       桶
   ** @params fileName         {string}       文件名
   ** @params space            {string}       空间
   ** @params folder           {string}       文件夹
   */
  fetchQiNiuToken({ fileName, bucket, space, folder }) {
    return request.post(API.qiniuToken, {
      bucket,
      space,
      folder,
      file_name: fileName,
      from: "web"
    });
  },
  /* 发送文件到七牛上
   ** @params key               {string}       文件名
   ** @params token             {string}       空间
   ** @params filePath          {string}       文件地址
   ** @params onUploadProgress  {function}     上传回调
   */
  uploadFileToQiNiu({ key, token, filePath, space }, onUploadProgress) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: API.qiniuUrl,
        filePath: filePath,
        name: "file",
        formData: {
          key: key,
          token: token
        },
        success: res => {
          resolve(res.data);
          if (res.statusCode === 200) {
            if (res.data.error_code !== 0) {
              reject(res.data);
            } else {
              resolve(res.data);
            }
          } else {
            reject(res.data.message);
          }
        },
        fail: err => {
          reject(err);
        }
      });
    });
  },
  /* 向服务器发送七牛的响应
   ** @params bucket           {string}       桶
   ** @params path             {string}       地址
   ** @params name             {string}       文件名
   ** @params title            {string}       重命名
   */
  sendQiNiuRes({ bucket, path, name, title, space }) {
    return request.post(API.qiniuStore, {
      bucket,
      path,
      name,
      title,
      space
    });
  }
};
