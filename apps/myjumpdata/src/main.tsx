import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/lib/integration/react";
import Spinner from "./components/Spinner";
import Wrapper from "./components/Wrapper";
import "./i18n";
import { persistor, store } from "./redux/store";
import "./styles.scss";

const FreestyleScreen = lazy(() => import("./screens/FreestyleScreen"));
const FreestyleGroupScreen = lazy(
  () => import("./screens/FreestyleGroupScreen")
);
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

const AdminHomeScreen = lazy(() => import("./screens/admin/AdminHomeScreen"));
const AdminUsersScreen = lazy(() => import("./screens/admin/AdminUsersScreen"));
const AdminFreestyleScreen = lazy(
  () => import("./screens/admin/AdminFreestyleScreen")
);
const AdminFreestyleElementScreen = lazy(
  () => import("./screens/admin/AdminFreestyleElementScreen")
);
const AdminFreestyleCreateScreen = lazy(
  () => import("./screens/admin/AdminFreestyleCreateScreen")
);
const AdminLocalizationScreen = lazy(
  () => import("./screens/admin/AdminLocalizationScreen")
);
const AdminLocalizationCreateScreen = lazy(
  () => import("./screens/admin/AdminLocalizationCreateScreen")
);

createRoot(document.getElementById("root") as Element).render(
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
              <Route path="/admin">
                <Route index element={<AdminHomeScreen />} />
                <Route path="users" element={<AdminUsersScreen />} />
                <Route path="freestyle">
                  <Route
                    index
                    element={<Navigate to="/admin/freestyle/list/" />}
                  />
                  <Route path="list" element={<AdminFreestyleScreen />} />
                  <Route path="list/:path" element={<AdminFreestyleScreen />} />
                  <Route
                    path="element/:id"
                    element={<AdminFreestyleElementScreen />}
                  />
                  <Route
                    path="create/:path"
                    element={<AdminFreestyleCreateScreen />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to="/admin/freestyle" />}
                  />
                </Route>
                <Route path="localization">
                  <Route index element={<AdminLocalizationScreen />} />
                  <Route
                    path="create/:namespace"
                    element={<AdminLocalizationCreateScreen />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to="/admin/localization" />}
                  />
                </Route>
                <Route path="*" element={<Navigate to="/admin" />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Wrapper>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </Suspense>
);
