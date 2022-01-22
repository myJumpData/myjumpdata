import AsyncStorage from "@react-native-community/async-storage";
import { combineReducers } from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import navigationReducer from "./navigation.reducer";
import userReducer from "./user.reducer";

const rootReducer = persistReducer(
  {
    key: "root",
    storage: AsyncStorage,
  },
  combineReducers({
    user: userReducer,
    navigation: navigationReducer,
  })
);

export default rootReducer;
