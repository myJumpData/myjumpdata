import { AnyAction, createStore, Reducer } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistReducer, persistStore } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";

const store = createStore(
  persistReducer(
    { key: "root", storage: storage, stateReconciler: autoMergeLevel2 },
    rootReducer as Reducer<unknown, AnyAction>
  ),
  composeWithDevTools()
);
export const persistor = persistStore(store);
export default store;
