import { createStore, Reducer } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";
import { composeWithDevTools } from "@redux-devtools/extension";

export const store =
  process.env.NODE_ENV === "development"
    ? createStore(
        persistReducer(
          { key: "root", storage: storage },
          rootReducer as Reducer<unknown>
        ),
        composeWithDevTools()
      )
    : createStore(
        persistReducer(
          { key: "root", storage: storage },
          rootReducer as Reducer<unknown>
        )
      );

export const persistor = persistStore(store);
