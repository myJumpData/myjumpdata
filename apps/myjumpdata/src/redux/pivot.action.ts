import { store } from "./store";

export function switchPivot() {
  const { pivot } = store.getState() as any;
  let payload: any;
  if (pivot === "users") {
    payload = "type";
  } else {
    payload = "users";
  }

  return store.dispatch({ type: "setPivot", payload });
}
