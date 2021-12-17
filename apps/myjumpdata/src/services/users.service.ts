import api from "./api";

const updateUsersRole = (roles: any) => {
  return api.put("/users/role", {roles: roles});
};

const getUsers = () => {
  return api.get("/users");
};

const updateUser = (userData: any) => {
  return api.put("/user", userData);
};

const deleteUser = () => {
  return api.delete("/user");
};

const UsersService = {
  updateUsersRole,
  getUsers,
  updateUser,
  deleteUser,
};

export default UsersService;
