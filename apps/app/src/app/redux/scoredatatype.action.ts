import store from "./store";

export function setScoredatatype(payload: string) {
  return store.dispatch({ type: "setScoredatatype", payload });
}
