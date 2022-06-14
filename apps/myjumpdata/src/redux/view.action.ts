import { store } from "./store";

export function setViewAuto() {
  return store.dispatch({ type: "setView", payload: "auto" });
}
export function setViewGrid() {
  return store.dispatch({ type: "setView", payload: "grid" });
}
export function setViewList() {
  return store.dispatch({ type: "setView", payload: "list" });
}
