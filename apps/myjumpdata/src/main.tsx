import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import App from "./App";
import Spinner from "./components/Spinner";
import SocketContext, { socket } from "./context/SocketContext";
import "./i18n";
import { persistor, store } from "./redux/store";
import "./styles.scss";

const queryClient = new QueryClient();

createRoot(document.getElementById("root") as Element).render(
  <QueryClientProvider client={queryClient}>
    <Suspense fallback={<Spinner wrapper />}>
      <SocketContext.Provider value={socket}>
        <Provider store={store}>
          <PersistGate loading={<Spinner />} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </SocketContext.Provider>
    </Suspense>
  </QueryClientProvider>
);
