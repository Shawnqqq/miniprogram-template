const MODE = "devlopment";
// const MODE = 'production';
const PRODUCTION_PREFIX = "";
const DEVELOPMENT_PREFIX = "";
const PREFIX = MODE === "production" ? PRODUCTION_PREFIX : DEVELOPMENT_PREFIX;

export default {
  MODE,
  // login
  login: `${PREFIX}/api/mini-program/account/login`,
  
  // common
  schoolList: `${PREFIX}/api/common/form-data/schools`,
  formData: `${PREFIX}/api/company/job/form/data`,
  // qiniu
  qiniuUrl: "https://upload.qiniup.com",
  qiniuConfig: `${PREFIX}/api/file/config`,
  qiniuToken: `${PREFIX}/api/file/qiniu-upload-token`,
  qiniuStore: `${PREFIX}/api/file/qiniu-file-store`
};
