import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import createSensitiveStorage from "redux-persist-sensitive-storage";
import userReducer from "./user.reducer";

const rootReducer = combineReducers({
  user: persistReducer(
    {
      key: "user",
      storage: createSensitiveStorage({
        keychainService: "myKeychain",
        sharedPreferencesName: "mySharedPrefs",
      }),
    },
    userReducer
  ),
});

export default rootReducer;
