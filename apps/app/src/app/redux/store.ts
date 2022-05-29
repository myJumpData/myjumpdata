import { createStore, Reducer } from "redux";
import { persistStore } from "redux-persist";
import rootReducer from "./rootReducer";

const store = createStore(rootReducer as Reducer<unknown>);
export const persistor = persistStore(store);

export default store;
