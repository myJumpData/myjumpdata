import { store } from "./store";

export function setRoute(payload: string) {
  return store.dispatch({ type: "setRoute", payload });
}
