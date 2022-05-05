import { combineReducers } from "redux";
import freestyleReducer from "./freestyle.reducer";
import messageReducer from "./message.reducer";
import routeReducer from "./route.reducer";
import userReducer from "./user.reducer";
import freestyleAdminReducer from "./freestyleAdmin.reducer";

const rootReducer = combineReducers({
  message: messageReducer,
  user: userReducer,
  freestyle: freestyleReducer,
  freestyleAdmin: freestyleAdminReducer,
  route: routeReducer,
});

export default rootReducer;
