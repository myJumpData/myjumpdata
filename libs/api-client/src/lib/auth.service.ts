import { setUser } from "@myjumpdata/store";
import api from "./api";

export const register = (username, firstname, lastname, email, password) => {
  return api.post("/auth/signup", {
    username,
    firstname,
    lastname,
    email,
    password,
    roles: ["athlete"],
  });
};

export const login = (username, password) => {
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
