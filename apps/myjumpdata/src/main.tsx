import { persistor, store } from "@myjumpdata/store";
import React, { lazy, Suspense } from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/lib/integration/react";
import "./i18n";
import Spinner from "./parts/Spinner";
import "./styles.scss";

const FreestyleScreen = lazy(() => import("./screens/FreestyleScreen"));
const GroupScreen = lazy(() => import("./screens/GroupScreen"));
const GroupSettingsScreen = lazy(() => import("./screens/GroupSettingsScreen"));
const LegalScreen = lazy(() => import("./screens/LegalScreen"));
const LoginScreen = lazy(() => import("./screens/LoginScreen"));
const MainScreen = lazy(() => import("./screens/MainScreen"));
const ProfileScreen = lazy(() => import("./screens/ProfileScreen"));
const RegisterScreen = lazy(() => import("./screens/RegisterScreen"));
const SettingsScreen = lazy(() => import("./screens/SettingsScreen"));
const SpeedDataOwnScreen = lazy(() => import("./screens/SpeedDataOwnScreen"));
const SpeedDataScreen = lazy(() => import("./screens/SpeedDataScreen"));
const TermsScreen = lazy(() => import("./screens/TermsScreen"));

ReactDOM.render(
  <Suspense fallback={<Spinner wrapper />}>
    <Provider store={store}>
      <PersistGate loading={<Spinner />} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            {"Main Pages"}
            <Route path="/" element={<MainScreen />} />

            <Route path="/terms" element={<TermsScreen />} />
            <Route path="/legal" element={<LegalScreen />} />

            {"Entry Pages"}
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/login" element={<LoginScreen />} />

            {"Profile Pages"}
            <Route path="/u/:username" element={<ProfileScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />

            {"Group Pages"}
            <Route path="/group" element={<GroupScreen />} />
            <Route path="/group/:id" element={<GroupScreen />} />
            <Route
              path="/group/:id/settings"
              element={<GroupSettingsScreen />}
            />

            {"Speeddata"}
            <Route path="/speeddata">
              <Route path="own/" element={<SpeedDataOwnScreen />} />
              <Route path="group/:id" element={<SpeedDataScreen />} />
            </Route>

            {"Freestyle"}
            {process.env.NODE_ENV === "development" && (
              <Route path="/freestyle" element={<FreestyleScreen />} />
            )}
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </Suspense>,
  document.getElementById("root")
);
