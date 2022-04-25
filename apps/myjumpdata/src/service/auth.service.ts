import { setUser } from "../redux/user.action";
import api from "./api";

export const register = (
  username: string,
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  checked: boolean
) => {
  return api.post("/auth/signup", {
    username,
    firstname,
    lastname,
    email,
    password,
    roles: ["athlete"],
    checked,
  });
};

export const login = (username: string, password: string) => {
  return api
    .post("/auth/signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data?.token) {
        setUser(response.data);
      }

      return response;
    });
};
