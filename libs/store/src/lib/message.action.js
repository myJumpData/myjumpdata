import { store } from "./store";

export function getMessage() {
  const { message } = store.getState();
  return message;
}
export function setMessage(payload) {
  return store.dispatch({ type: "setMessage", payload });
}
export function clearMessage() {
  return store.dispatch({ type: "clearMessage" });
}
