import { store } from "./store";

export function getUser() {
  const { user } = store.getState();
  return user;
}
export function setUser(payload) {
  return store.dispatch({ type: "setUser", payload });
}
export function clearUser() {
  return store.dispatch({ type: "clearUser" });
}
