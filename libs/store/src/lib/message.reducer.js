const messageReducer = (
  state = { text: "", design: "primary", icon: true },
  action
) => {
  if (action.type === "setMessage") {
    const newState = {
      text: action.payload.text ? action.payload.text : state.text,
      design: action.payload.design ? action.payload.design : state.design,
      icon: action.payload.icon ? action.payload.icon : state.icon,
    };
    return newState;
  }
  if (action.type === "clearMessage") {
    const newState = {
      text: "",
      design: "primary",
      icon: true,
    };
    return newState;
  }
  return state;
};

export default messageReducer;
