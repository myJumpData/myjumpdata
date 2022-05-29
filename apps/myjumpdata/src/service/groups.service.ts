import api from "./api";

export const createGroup = (name: string, club: string) => {
  return api.post("/groups", { name, club });
};

export const getGroups = () => {
  return api.get("/groups");
};

export const getClub = (id?: string) => {
  if (id) {
    return api.get("/club/" + id);
  }
  return api.get("/club");
};
export const addMemberToClub = (id, users) => {
  return api.post(`/club/${id}/athletes/add`, { users });
};
export const removeMemberFromClub = (id, users) => {
  return api.post(`/club/${id}/athletes/remove`, { users });
};
export const addCoachToClub = (id, users) => {
  return api.post(`/club/${id}/coaches/add`, { users });
};
export const removeCoachFromClub = (id, users) => {
  return api.post(`/club/${id}/coaches/remove`, { users });
};
export const addAdminToClub = (id, users) => {
  return api.post(`/club/${id}/admins/add`, { users });
};
export const removeAdminFromClub = (id, users) => {
  return api.post(`/club/${id}/admins/remove`, { users });
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

export const leaveGroup = (id: string) => {
  return api.post(`/group_leave/${id}`);
};

export const leaveClub = () => {
  return api.post(`/club_leave`);
};
