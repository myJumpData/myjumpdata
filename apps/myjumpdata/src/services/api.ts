import axios from "axios";
import {CONF} from "../Constants";
import TokenService from "./token.service";

const instance = axios.create({
  baseURL: CONF.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = TokenService.getLocalAccessToken();
  if (token) {
    // @ts-ignore
    config.headers["x-access-token"] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    return Promise.reject(err);
  }
);

export default instance;
