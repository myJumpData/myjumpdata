import api from "./api";

export const updateUsersRole = (roles) => {
  return api.put("/users/role", { roles: roles });
};

export const searchUsers = (search) => {
  const s = search.replace(/^[^A-Z0-9]+$/i, "");
  if (s === "") {
    return Promise.resolve({ status: 200, data: null });
  }
  return api.get(`/users/${s}`);
};

export const updateUser = (userData) => {
  return api.put("/user", userData);
};

export const deleteUser = () => {
  return api.delete("/user");
};
export function getUserSearch(search) {
  return api.get(`/user/${search}`);
}
