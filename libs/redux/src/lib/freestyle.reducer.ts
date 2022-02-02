const freestyleReducer = (state = "", action: any) => {
  if (action.type === "setFreestyle") {
    return action.payload;
  }
  if (action.type === "clearFreestyle") {
    return "";
  }
  return state;
};

export default freestyleReducer;
