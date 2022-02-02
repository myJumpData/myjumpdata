import { store } from "./store";

export function getFreestyle() {
  const { freestyle } = store.getState() as any;
  return freestyle;
}
export function setFreestyle(payload: string) {
  return store.dispatch({ type: "setFreestyle", payload });
}
export function clearFreestyle() {
  return store.dispatch({ type: "clearFreestyle" });
}
