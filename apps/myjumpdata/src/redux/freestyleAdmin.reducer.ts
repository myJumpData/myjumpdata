const freestyleAdminReducer = (state = "", action: any) => {
  if (action.type === "setFreestyleAdmin") {
    return action.payload;
  }
  if (action.type === "clearFreestyleAdmin") {
    return "";
  }
  return state;
};

export default freestyleAdminReducer;
