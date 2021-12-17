import api from "./api";

const createGroup = (name: String) => {
  return api.post("/groups", {name});
};

const getGroups = () => {
  return api.get("/groups");
};

const getGroup = (id: any) => {
  return api.get(`/groups/${id}`);
};

const addUsersToGroup = (id: any, users: any) => {
  return api.put(`/groups/${id}/athletes/add`, {users});
};

const removeUsersFromGroup = (id: any, users: any) => {
  return api.put(`/groups/${id}/athletes/remove`, {users});
};

const addCoachesToGroup = (id: any, coach: any) => {
  return api.put(`/groups/${id}/coaches/add`, {coach});
};

const removeCoachesFromGroup = (id: any, coach: any) => {
  return api.put(`/groups/${id}/coaches/remove`, {coach});
};

const updateGroupName = (name: string, id: any) => {
  return api.put(`/groups/${id}`, {name});
};

const deleteGroup = (id: any) => {
  return api.delete(`/group/${id}`);
};

const GroupsService = {
  createGroup,
  getGroups,
  getGroup,
  addUsersToGroup,
  removeUsersFromGroup,
  addCoachesToGroup,
  removeCoachesFromGroup,
  updateGroupName,
  deleteGroup,
};

export default GroupsService;
