const viewReducer = (state = "auto", action: any) => {
  if (action.type === "setView") {
    return action.payload;
  }
  return state;
};

export default viewReducer;
