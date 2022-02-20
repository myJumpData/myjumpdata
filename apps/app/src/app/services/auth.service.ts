import { setUser } from "../redux/user.action";
import api from "./api";

const register = (
  username: any,
  firstname: any,
  lastname: any,
  email: any,
  password: any,
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
