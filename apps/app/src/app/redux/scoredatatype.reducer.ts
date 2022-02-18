const scoredatatypeReducer = (state = "", action: any) => {
  if (action.type === "setScoredatatype") {
    return action.payload;
  }
  if (action.type === "clearScoredatatype") {
    return "";
  }
  return state;
};

export default scoredatatypeReducer;
