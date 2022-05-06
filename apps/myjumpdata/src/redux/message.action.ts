import { MessageType } from "./message.reducer";
import { store } from "./store";

export function setMessage(payload: MessageType) {
  return store.dispatch({ type: "setMessage", payload });
}
export function clearMessage() {
  return store.dispatch({ type: "clearMessage" });
}
