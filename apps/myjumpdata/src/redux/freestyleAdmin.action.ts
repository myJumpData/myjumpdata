import { store } from "./store";

export function getFreestyleAdmin() {
  const { freestyle } = store.getState() as any;
  return freestyle;
}
export function setFreestyleAdmin(payload: string) {
  return store.dispatch({ type: "setFreestyleAdmin", payload });
}
export function clearFreestyleAdmin() {
  return store.dispatch({ type: "clearFreestyleAdmin" });
}
