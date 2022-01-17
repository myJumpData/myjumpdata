import axios, { AxiosError, AxiosResponse } from "axios";
import { CONF } from "../Constants";
import responseHandler from "../helper/responseHandler";
import { getUser } from "../store/user.action";

const instance = axios.create({
  baseURL: CONF.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const user = getUser();
    if (user && user.token) {
      // @ts-ignore
      config.headers["x-access-token"] = user.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res: AxiosResponse<any, any>) => {
    return responseHandler(res);
  },
  (err: AxiosError) => {
    return responseHandler(err.response as AxiosResponse<any, any>);
  }
);

export default instance;
