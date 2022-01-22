const navigationReducer = (
  state = {
    index: undefined,
    key: undefined,
    routeNames: [],
    routes: [],
    stale: undefined,
    type: undefined,
  },
  action: any
) => {
  if (action.type === "setNavigation") {
    return action.payload;
  }
  return state;
};
export default navigationReducer;
