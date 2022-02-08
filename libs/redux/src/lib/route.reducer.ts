const routeReducer = (state = "/", action: any) => {
  if (action.type === "setRoute") {
    return action.payload;
  }
  return state;
};

export default routeReducer;
