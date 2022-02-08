import { store } from "./store";

export function getRoute() {
  const { route } = store.getState() as any;
  return route;
}
export function setRoute(payload: string) {
  return store.dispatch({ type: "setRoute", payload });
}
