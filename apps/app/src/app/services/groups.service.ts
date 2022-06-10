import api from "./api";

const createGroup = (name: string, club: string) => {
  return api.post("/groups", { name, club });
};

const getGroups = () => {
  return api.get("/groups");
};

const getClub = (id?: string) => {
  if (id) {
    return api.get("/club/" + id);
  }
  return api.get("/club");
};
const addMemberToClub = (id, users) => {
  return api.post(`/club/${id}/athletes/add`, { users });
};
const removeMemberFromClub = (id, users) => {
  return api.post(`/club/${id}/athletes/remove`, { users });
};
const addCoachToClub = (id, users) => {
  return api.post(`/club/${id}/coaches/add`, { users });
};
const removeCoachFromClub = (id, users) => {
  return api.post(`/club/${id}/coaches/remove`, { users });
};
const addAdminToClub = (id, users) => {
  return api.post(`/club/${id}/admins/add`, { users });
};
const removeAdminFromClub = (id, users) => {
  return api.post(`/club/${id}/admins/remove`, { users });
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
const leaveClub = () => {
  return api.post(`/club_leave`);
};

const GroupsService = {
  getClub,
  addMemberToClub,
  removeMemberFromClub,
  addCoachToClub,
  removeCoachFromClub,
  addAdminToClub,
  removeAdminFromClub,
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
  leaveClub,
};

export default GroupsService;
