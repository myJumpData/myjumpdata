export interface MessageType {
  text: string | null;
  design?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  icon?: boolean;
}
const messageReducer = (
  state: MessageType = { text: "", design: "primary", icon: true },
  action: any
) => {
  if (action.type === "setMessage") {
    const newState: MessageType = {
      text: action.payload.text ? action.payload.text : state.text,
      design: action.payload.design ? action.payload.design : state.design,
      icon: action.payload.icon ? action.payload.icon : state.icon,
    };
    return newState;
  }
  if (action.type === "clearMessage") {
    const newState: MessageType = {
      text: "",
      design: "primary",
      icon: true,
    };
    return newState;
  }
  return state;
};

export default messageReducer;
