import api from "./api";
import TokenService from "./token.service";

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
        TokenService.setUser(response.data);
      }

      return response;
    });
};

const logout = () => {
  TokenService.removeUser();
};

const getCurrentUser = () => {
  return {
    currentUser: TokenService.getUser(),
    isCoach: TokenService.getUser()?.roles.includes("coach"),
  };
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
