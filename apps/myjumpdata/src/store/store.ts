import { AnyAction, createStore, Reducer } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";

const store = createStore(
  persistReducer(
    { key: "root", storage: storage },
    rootReducer as Reducer<unknown, AnyAction>
  ),
  composeWithDevTools()
);
export const persistor = persistStore(store);
export default store;
