import api from "./api";

export const updateUsersRole = (roles: string[]) => {
  return api.put("/users/role", { roles: roles });
};

export const searchUsers = (search: string) => {
  const s = search.replace(/^[^A-Z0-9]+$/i, "");
  if (s === "") {
    return Promise.resolve({ status: 200, data: null });
  }
  return api.get(`/users/${s}`);
};

export const updateUser = (userData) => {
  return api.post("/user_edit", userData);
};

export const deleteUser = () => {
  return api.post("/user_del");
};
export function getUserSearch(search: string) {
  return api.get(`/user/${search}`);
}
