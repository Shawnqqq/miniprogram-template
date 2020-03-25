import wxRequest from "./../request/request.js";
import API from "./../request/api.js";

export default {
  example1(params = {}) {
    return wxRequest.get(API.example, params);
  },
  example2(id) {
    return wxRequest.get(API.example(id));
  }
};
