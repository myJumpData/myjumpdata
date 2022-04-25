import axios, { AxiosError, AxiosResponse } from "axios";
import responseHandler from "../helper/responseHandler";
import { getUser } from "../redux/user.action";

const instance = axios.create({
  baseURL:
    process.env["NODE_ENV"] === "development"
      ? "http://10.0.2.2:3333/"
      : "https://api.myjumpdata.fediv.me",
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
