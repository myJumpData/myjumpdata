const userReducer = (state = {}, action) => {
  if (action.type === "setUser") {
    const newState = {
      active: action.payload.active ? action.payload.active : state.active,
      email: action.payload.email ? action.payload.email : state.email,
      firstname: action.payload.firstname
        ? action.payload.firstname
        : state.firstname,
      lastname: action.payload.lastname
        ? action.payload.lastname
        : state.lastname,
      username: action.payload.username
        ? action.payload.username
        : state.username,
      id: action.payload.id ? action.payload.id : state.id,
      picture: action.payload.picture ? action.payload.picture : state.picture,
      token: action.payload.token ? action.payload.token : state.token,
      roles: action.payload.roles ? action.payload.roles : state.roles,
    };
    return newState;
  }
  if (action.type === "clearUser") {
    const newState = {
      active: undefined,
      email: undefined,
      firstname: undefined,
      lastname: undefined,
      username: undefined,
      id: undefined,
      picture: undefined,
      token: undefined,
      roles: undefined,
    };
    return newState;
  }
  return state;
};

export default userReducer;
