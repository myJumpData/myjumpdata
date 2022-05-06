import api from "./api";
const updateUsersRole = (roles: string[]) => {
  return api.put("/users/role", { roles: roles });
};
const searchUsers = (search: string) => {
  const s = search.replace(/^[^A-Z\d]+$/i, "");
  if (s === "") {
    return Promise.resolve({ status: 200, data: null });
  }
  return api.get(`/users/${s}`);
};
const updateUser = (userData) => {
  return api.post("/user_edit", userData);
};
const deleteUser = () => {
  return api.post("/user_del");
};
function getUserSearch(search: string) {
  return api.get(`/user/${search}`);
}

const UsersService = {
  getUserSearch,
  updateUsersRole,
  searchUsers,
  updateUser,
  deleteUser,
};

export default UsersService;
