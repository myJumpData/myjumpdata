import api from "./api";

export function getUserSearch(search: string) {
  return api.get(`/user/${search}`);
}
