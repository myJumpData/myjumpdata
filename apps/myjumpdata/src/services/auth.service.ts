import { setUser } from "../store/user.action";
import api from "./api";

const register = (
  username: any,
  firstname: any,
  lastname: any,
  email: any,
  password: any
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

const login = (username: any, password: any) => {
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

const AuthService = {
  register,
  login,
};

export default AuthService;
