import store from "./store";

export function getScoredatatype() {
  const { scoredatatype } = store.getState() as any;
  return scoredatatype;
}
export function setScoredatatype(payload: string) {
  return store.dispatch({ type: "setScoredatatype", payload });
}
