import { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Wrapper from "./components/Wrapper";
import "./i18n";
import "./styles.scss";

const AdminClubScreen = lazy(() => import("./screens/admin/AdminClubScreen"));
const AdminClubCreateScreen = lazy(
  () => import("./screens/admin/AdminClubCreateScreen")
);
const AdminLocalizationUpdateScreen = lazy(
  () => import("./screens/admin/AdminLocalizationUpdateScreen")
);
const ClubScreen = lazy(() => import("./screens/ClubScreen"));
const ClubAdminScreen = lazy(() => import("./screens/ClubAdmin"));
const GroupPlayerScreen = lazy(() => import("./screens/GroupPlayerScreen"));
const FreestyleScreen = lazy(() => import("./screens/FreestyleScreen"));
const FreestyleGroupScreen = lazy(
  () => import("./screens/FreestyleGroupScreen")
);
const GroupScreen = lazy(() => import("./screens/GroupScreen"));
const GroupsScreen = lazy(() => import("./screens/GroupsScreen"));
const GroupSettingsScreen = lazy(() => import("./screens/GroupSettingsScreen"));
const PlayerScreen = lazy(() => import("./screens/PlayerScreen"));
const LegalScreen = lazy(() => import("./screens/LegalScreen"));
const LoginScreen = lazy(() => import("./screens/LoginScreen"));
const MainScreen = lazy(() => import("./screens/MainScreen"));
const ProfileScreen = lazy(() => import("./screens/ProfileScreen"));
const RegisterScreen = lazy(() => import("./screens/RegisterScreen"));
const SettingsScreen = lazy(() => import("./screens/SettingsScreen"));
const SpeedDataOwnScreen = lazy(() => import("./screens/SpeedDataOwnScreen"));
const SpeedDataScreen = lazy(() => import("./screens/SpeedDataScreen"));
const TermsScreen = lazy(() => import("./screens/TermsScreen"));
const TeamScreen = lazy(() => import("./screens/TeamScreen"));
const TeamSettingsScreen = lazy(() => import("./screens/TeamSettingsScreen"));
const TeamPlayerScreen = lazy(() => import("./screens/TeamPlayerScreen"));
const TeamSpeedScreen = lazy(() => import("./screens/TeamSpeedScreen"));

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
const LiveScreen = lazy(() => import("./screens/LiveScreen"));

export default function App() {
  return (
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
            //"Live"
          }
          <Route path="/live" element={<LiveScreen />} />
          {
            //"Profile Pages"
          }
          <Route path="/u/:username" element={<ProfileScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />

          {
            //"Group Pages"
          }
          <Route path="/group" element={<GroupsScreen />} />
          <Route path="/group/player/:id" element={<GroupPlayerScreen />} />
          <Route path="/club/page/:id" element={<ClubScreen />} />
          <Route path="/club/admin" element={<ClubAdminScreen />} />
          <Route path="/group/:id" element={<GroupScreen />} />
          <Route path="/group/:id/settings" element={<GroupSettingsScreen />} />
          {
            //"Team"
          }
          <Route path="team">
            <Route path=":id" element={<TeamScreen />} />
            <Route path=":id/settings" element={<TeamSettingsScreen />} />
            <Route path=":id/player" element={<TeamPlayerScreen />} />
            <Route path=":id/speeddata" element={<TeamSpeedScreen />} />
          </Route>

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
            <Route path="own" element={<FreestyleScreen />} />
            <Route path="own/:freestyle" element={<FreestyleScreen />} />
            <Route path="group/:id" element={<FreestyleGroupScreen />} />
            <Route
              path="group/:id/:freestyle"
              element={<FreestyleGroupScreen />}
            />
          </Route>

          {
            //"Player"
          }
          <Route path="/player">
            <Route index element={<PlayerScreen />} />
          </Route>

          {
            //"Admin"
          }
          <Route path="/admin">
            <Route index element={<AdminHomeScreen />} />
            <Route path="users" element={<AdminUsersScreen />} />
            <Route path="freestyle">
              <Route index element={<Navigate to="/admin/freestyle/list/" />} />
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
              <Route path="*" element={<Navigate to="/admin/freestyle" />} />
            </Route>
            <Route path="localization">
              <Route index element={<AdminLocalizationScreen />} />
              <Route
                path="create/:namespace"
                element={<AdminLocalizationCreateScreen />}
              />
              <Route
                path="update/:namespace/:key"
                element={<AdminLocalizationUpdateScreen />}
              />
              <Route path="*" element={<Navigate to="/admin/localization" />} />
            </Route>
            <Route path="club">
              <Route index element={<AdminClubScreen />} />
              <Route path="create" element={<AdminClubCreateScreen />} />
              <Route path="*" element={<Navigate to="/admin/club" />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin" />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Wrapper>
    </BrowserRouter>
  );
}
