import api from "./api"

export function getUser(search: string) {
  return api.get(`/user/${search}`)
}