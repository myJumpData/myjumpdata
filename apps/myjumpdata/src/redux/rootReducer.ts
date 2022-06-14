import { combineReducers } from "redux";
import messageReducer from "./message.reducer";
import pivotReducer from "./pivot.reducer";
import routeReducer from "./route.reducer";
import userReducer from "./user.reducer";
import viewReducer from "./view.reducer";

const rootReducer = combineReducers({
  message: messageReducer,
  user: userReducer,
  route: routeReducer,
  pivot: pivotReducer,
  view: viewReducer,
});

export default rootReducer;
