import { AnyAction, createStore, Reducer } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";
import { composeWithDevTools } from "@redux-devtools/extension";

export const store =
  process.env.NODE_ENV === "development"
    ? createStore(
        persistReducer(
          { key: "root", storage: storage },
          rootReducer as Reducer<unknown, AnyAction>
        ),
        composeWithDevTools()
      )
    : createStore(
        persistReducer(
          { key: "root", storage: storage },
          rootReducer as Reducer<unknown, AnyAction>
        )
      );

export const persistor = persistStore(store);
