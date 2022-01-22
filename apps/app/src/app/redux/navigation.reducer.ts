const navigationReducer = (state = {}, action: any) => {
  if (action.type === "setNavigation") {
    return action.payload;
  }
  return state;
};
export default navigationReducer;
