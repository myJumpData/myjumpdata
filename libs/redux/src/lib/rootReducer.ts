import { combineReducers } from "redux";
import freestyleReducer from "./freestyle.reducer";
import messageReducer from "./message.reducer";
import userReducer from "./user.reducer";

const rootReducer = combineReducers({
  message: messageReducer,
  user: userReducer,
  freestyle: freestyleReducer,
});

export default rootReducer;
