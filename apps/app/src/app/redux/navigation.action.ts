import store from "./store";

export function setNavigation(payload: any) {
  return store.dispatch({ type: "setNavigation", payload });
}
