import { store } from "./store";
import { UserType } from "./user.reducer";

export function getUser() {
  const { user } = store.getState() as any;
  return user;
}
export function setUser(payload: UserType) {
  return store.dispatch({ type: "setUser", payload });
}
export function clearUser() {
  return store.dispatch({ type: "clearUser" });
}
