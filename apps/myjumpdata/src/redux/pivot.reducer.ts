const pivotReducer = (state = "users", action: any) => {
  if (action.type === "setPivot") {
    return action.payload;
  }
  return state;
};

export default pivotReducer;
