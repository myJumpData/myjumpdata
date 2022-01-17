import { ReactNode } from "react";
import { Provider } from "react-redux";
import { Outlet } from "react-router-dom";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/lib/integration/react";

export default function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<Outlet />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
