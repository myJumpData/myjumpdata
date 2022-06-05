import api from "./api";

export const addUsersToTeam = (id: string, users) => {
  return api.post(`/team/${id}/athletes/add`, { users });
};

export const removeUsersFromTeam = (id: string, users) => {
  return api.post(`/team/${id}/athletes/remove`, { users });
};

export const addCoachesToTeam = (id: string, coach) => {
  return api.post(`/team/${id}/coaches/add`, { coach });
};

export const removeCoachesFromTeam = (id: string, coach) => {
  return api.post(`/team/${id}/coaches/remove`, { coach });
};

export const updateTeamName = (name: string, id: string) => {
  return api.post(`/team_name/${id}`, { name });
};

export const getTeam = (id: string) => {
  return api.get(`/team/${id}`);
};

export const deleteTeam = (id: string) => {
  return api.post(`/team_del/${id}`);
};

export const getTeams = () => {
  return api.get("/teams");
};

export const createTeam = (name: string, club: string) => {
  return api.post("/team", { name, club });
};

export const leaveTeam = (id: string) => {
  return api.post(`/team_leave/${id}`);
};
