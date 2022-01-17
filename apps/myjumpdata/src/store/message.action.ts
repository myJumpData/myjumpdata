import { MessageType } from "./message.reducer";
import store from "./store";

export function getMessage() {
  const { message } = store.getState() as any;
  return message;
}
export function setMessage(payload: MessageType) {
  return store.dispatch({ type: "setMessage", payload });
}
export function clearMessage() {
  return store.dispatch({ type: "clearMessage" });
}
