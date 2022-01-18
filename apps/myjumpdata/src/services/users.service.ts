import api from "./api";

const updateUsersRole = (roles: any) => {
  return api.put("/users/role", { roles: roles });
};

const searchUsers = (search: string) => {
  const s = search.replace(/^[^A-Z0-9]+$/i, "");
  if (s === "") {
    return Promise.resolve({ status: 200, data: null });
  }
  return api.get(`/users/${s}`);
};

const updateUser = (userData: any) => {
  return api.put("/user", userData);
};

const deleteUser = () => {
  return api.delete("/user");
};

const UsersService = {
  updateUsersRole,
  searchUsers,
  updateUser,
  deleteUser,
};

export default UsersService;
