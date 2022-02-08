import { persistor, store } from "@myjumpdata/redux";
import React, { lazy, Suspense } from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/lib/integration/react";
import "./i18n";
import Spinner from "./parts/Spinner";
import Wrapper from "./parts/Wrapper";
import FreestyleGroupScreen from "./screens/FreestyleGroupScreen";
import "./styles.scss";

const FreestyleScreen = lazy(() => import("./screens/FreestyleScreen"));
const GroupScreen = lazy(() => import("./screens/GroupScreen"));
const GroupsScreen = lazy(() => import("./screens/GroupsScreen"));
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
const AdminScreen = lazy(() => import("./screens/AdminScreen"));

ReactDOM.render(
  <Suspense fallback={<Spinner wrapper />}>
    <Provider store={store}>
      <PersistGate loading={<Spinner />} persistor={persistor}>
        <BrowserRouter>
          <Wrapper>
            <Routes>
              {
                //"Main Pages"
              }
              <Route path="/" element={<MainScreen />} />

              <Route path="/terms" element={<TermsScreen />} />
              <Route path="/legal" element={<LegalScreen />} />

              {
                //"Entry Pages"
              }
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/login" element={<LoginScreen />} />

              {
                //"Profile Pages"
              }
              <Route path="/u/:username" element={<ProfileScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />

              {
                //"Group Pages"
              }
              <Route path="/group" element={<GroupsScreen />} />
              <Route path="/group/:id" element={<GroupScreen />} />
              <Route
                path="/group/:id/settings"
                element={<GroupSettingsScreen />}
              />

              {
                //"Speeddata"
              }
              <Route path="/speeddata">
                <Route path="own/" element={<SpeedDataOwnScreen />} />
                <Route path="group/:id" element={<SpeedDataScreen />} />
              </Route>

              {
                //"Freestyle"
              }
              <Route path="/freestyle">
                <Route path="own/" element={<FreestyleScreen />} />
                <Route path="group/:id" element={<FreestyleGroupScreen />} />
              </Route>

              {
                //"Admin"
              }
              <Route path="/admin/*" element={<AdminScreen />} />
            </Routes>
          </Wrapper>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </Suspense>,
  document.getElementById("root")
);
