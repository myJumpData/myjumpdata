import axios from "axios";
import { getUser } from "../redux/user.action";
import getApi from "../utils/getApi";
import responseHandler from "./responseHandler";

const instance = axios.create({
  baseURL: getApi(),
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const user = getUser();
    if (user && user.token && config.headers) {
      config.headers["x-access-token"] = user.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return responseHandler(res);
  },
  (err) => {
    return responseHandler(err.response);
  }
);

export default instance;
