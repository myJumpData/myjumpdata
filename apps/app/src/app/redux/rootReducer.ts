import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import freestyleReducer from "./freestyle.reducer";
import navigationReducer from "./navigation.reducer";
import playerReducer from "./player.reducer";
import scoredatatypeReducer from "./scoredatatype.reducer";
import userReducer from "./user.reducer";
import pivotReducer from "./pivot.reducer";

const rootReducer = persistReducer(
  {
    key: "root",
    storage: AsyncStorage,
  },
  combineReducers({
    user: userReducer,
    navigation: navigationReducer,
    freestyle: freestyleReducer,
    scoredatatype: scoredatatypeReducer,
    player: playerReducer,
    pivot: pivotReducer,
  })
);

export default rootReducer;
