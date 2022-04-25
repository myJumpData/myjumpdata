import { getUser } from "@myjumpdata/redux";
import axios from "axios";
import responseHandler from "./responseHandler";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3333"
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
  (res) => {
    return responseHandler(res);
  },
  (err) => {
    return responseHandler(err.response);
  }
);

export default instance;
