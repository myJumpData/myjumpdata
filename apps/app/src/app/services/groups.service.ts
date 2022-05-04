import api from "./api";
const createGroup = (name: string) => {
  return api.post("/groups", { name });
};
const getGroups = () => {
  return api.get("/groups");
};
const getGroup = (id: string) => {
  return api.get(`/groups/${id}`);
};
const addUsersToGroup = (id: string, users) => {
  return api.post(`/groups/${id}/athletes/add`, { users });
};
const removeUsersFromGroup = (id: string, users) => {
  return api.post(`/groups/${id}/athletes/remove`, { users });
};
const addCoachesToGroup = (id: string, coach) => {
  return api.post(`/groups/${id}/coaches/add`, { coach });
};
const removeCoachesFromGroup = (id: string, coach) => {
  return api.post(`/groups/${id}/coaches/remove`, { coach });
};
const updateGroupName = (name: string, id: string) => {
  return api.post(`/groups_name/${id}`, { name });
};
const deleteGroup = (id: string) => {
  return api.post(`/group_del/${id}`);
};
const leaveGroup = (id: string) => {
  return api.post(`/group_leave/${id}`);
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
  leaveGroup,
};

export default GroupsService;
