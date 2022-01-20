import { AnyAction, createStore, Reducer } from "redux";
import rootReducer from "./rootReducer";

const store = createStore(rootReducer as Reducer<unknown, AnyAction>);

export default store;
