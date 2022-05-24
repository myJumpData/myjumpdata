import api from "./api";

export const searchUsers = (search: string) => {
  const s = search.replace(/^[^A-Z\d]+$/i, "");
  if (s === "") {
    return Promise.resolve({ status: 200, data: null });
  }
  return api.get(`/users/${s}`);
};
export const searchUsersAll = (search: string) => {
  const s = search.replace(/^[^A-Z\d]+$/i, "");
  if (s === "") {
    return Promise.resolve({ status: 200, data: null });
  }
  return api.get(`/users_all/${s}`);
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
