import api from "./api";

export const createGroup = (name) => {
  return api.post("/groups", { name });
};

export const getGroups = () => {
  return api.get("/groups");
};

export const getGroup = (id) => {
  return api.get(`/groups/${id}`);
};

export const addUsersToGroup = (id, users) => {
  return api.post(`/groups/${id}/athletes/add`, { users });
};

export const removeUsersFromGroup = (id, users) => {
  return api.post(`/groups/${id}/athletes/remove`, { users });
};

export const addCoachesToGroup = (id, coach) => {
  return api.post(`/groups/${id}/coaches/add`, { coach });
};

export const removeCoachesFromGroup = (id, coach) => {
  return api.post(`/groups/${id}/coaches/remove`, { coach });
};

export const updateGroupName = (name, id) => {
  return api.put(`/groups/${id}`, { name });
};

export const deleteGroup = (id) => {
  return api.delete(`/group/${id}`);
};
