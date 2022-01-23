import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";

export const store =
  process.env.NODE_ENV === "development"
    ? createStore(
        persistReducer({ key: "root", storage: storage }, rootReducer),
        composeWithDevTools()
      )
    : createStore(
        persistReducer({ key: "root", storage: storage }, rootReducer)
      );

export const persistor = persistStore(store);
