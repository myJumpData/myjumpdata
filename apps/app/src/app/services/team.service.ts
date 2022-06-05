import api from "./api";

const addUsersToTeam = (id: string, users) => {
  return api.post(`/team/${id}/athletes/add`, { users });
};

const removeUsersFromTeam = (id: string, users) => {
  return api.post(`/team/${id}/athletes/remove`, { users });
};

const addCoachesToTeam = (id: string, coach) => {
  return api.post(`/team/${id}/coaches/add`, { coach });
};

const removeCoachesFromTeam = (id: string, coach) => {
  return api.post(`/team/${id}/coaches/remove`, { coach });
};

const updateTeamName = (name: string, id: string) => {
  return api.post(`/team_name/${id}`, { name });
};

const getTeam = (id: string) => {
  return api.get(`/team/${id}`);
};

const deleteTeam = (id: string) => {
  return api.post(`/team_del/${id}`);
};

const getTeams = () => {
  return api.get("/teams");
};

const createTeam = (name: string, club: string) => {
  return api.post("/team", { name, club });
};

const leaveTeam = (id: string) => {
  return api.post(`/team_leave/${id}`);
};

const TeamService = {
  addUsersToTeam,
  removeUsersFromTeam,
  addCoachesToTeam,
  removeCoachesFromTeam,
  updateTeamName,
  getTeam,
  deleteTeam,
  getTeams,
  createTeam,
  leaveTeam,
};

export default TeamService;
