import api from "./api";

export const createGroup = (name: string) => {
  return api.post("/groups", { name });
};

export const getGroups = () => {
  return api.get("/groups");
};

export const getGroup = (id: string) => {
  return api.get(`/groups/${id}`);
};

export const addUsersToGroup = (id: string, users) => {
  return api.post(`/groups/${id}/athletes/add`, { users });
};

export const removeUsersFromGroup = (id: string, users) => {
  return api.post(`/groups/${id}/athletes/remove`, { users });
};

export const addCoachesToGroup = (id: string, coach) => {
  return api.post(`/groups/${id}/coaches/add`, { coach });
};

export const removeCoachesFromGroup = (id: string, coach) => {
  return api.post(`/groups/${id}/coaches/remove`, { coach });
};

export const updateGroupName = (name: string, id: string) => {
  return api.post(`/groups_name/${id}`, { name });
};

export const deleteGroup = (id: string) => {
  return api.post(`/group_del/${id}`);
};
