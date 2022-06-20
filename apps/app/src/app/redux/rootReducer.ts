import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBundleId } from "react-native-device-info";
import { combineReducers } from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import freestyleReducer from "./freestyle.reducer";
import navigationReducer from "./navigation.reducer";
import pivotReducer from "./pivot.reducer";
import playerReducer from "./player.reducer";
import scoredatatypeReducer from "./scoredatatype.reducer";
import userReducer from "./user.reducer";

const rootReducer = persistReducer(
  {
    key: getBundleId(),
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
