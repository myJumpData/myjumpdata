import { setUser } from "@myjumpdata/redux";
import api from "./api";

export const register = (
  username: string,
  firstname: string,
  lastname: string,
  email: string,
  password: string
) => {
  return api.post("/auth/signup", {
    username,
    firstname,
    lastname,
    email,
    password,
    roles: ["athlete"],
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
