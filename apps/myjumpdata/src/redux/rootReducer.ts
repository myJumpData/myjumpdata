import { combineReducers } from "redux";
import freestyleReducer from "./freestyle.reducer";
import messageReducer from "./message.reducer";
import routeReducer from "./route.reducer";
import userReducer from "./user.reducer";
import pivotReducer from "./pivot.reducer";

const rootReducer = combineReducers({
  message: messageReducer,
  user: userReducer,
  freestyle: freestyleReducer,
  route: routeReducer,
  pivot: pivotReducer,
});

export default rootReducer;
