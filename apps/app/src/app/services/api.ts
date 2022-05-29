import axios, { AxiosError, AxiosResponse } from "axios";
import responseHandler from "../helper/responseHandler";
import { getUser } from "../redux/user.action";
import getApi from "../utils/getApi";

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
  (res: AxiosResponse) => {
    return responseHandler(res);
  },
  (err: AxiosError) => {
    return responseHandler(err.response as AxiosResponse);
  }
);

export default instance;
