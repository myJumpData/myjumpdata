export interface UserType {
  active?: boolean;
  email?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  id?: string;
  picture?: string;
  token?: string;
  roles?: string[];
  checked?: boolean;
}
const userReducer = (state: UserType = {}, action: any) => {
  if (action.type === "setUser") {
    const newState: UserType = {
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
      checked: action.payload.checked ? action.payload.checked : state.checked,
    };
    return newState;
  }
  if (action.type === "clearUser") {
    const newState: UserType = {
      active: undefined,
      email: undefined,
      firstname: undefined,
      lastname: undefined,
      username: undefined,
      id: undefined,
      picture: undefined,
      token: undefined,
      roles: undefined,
      checked: undefined,
    };
    return newState;
  }
  return state;
};

export default userReducer;
