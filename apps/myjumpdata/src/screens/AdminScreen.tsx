import { setRoute } from "@myjumpdata/redux";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

export default function AdminScreen() {
  return (
    <Routes>
      <Route path="/home" element={<AdminHomeScreen />} />
      <Route path="/users" element={<AdminUsersScreen />} />
      <Route path="/groups" element={<AdminGroupsScreen />} />
      <Route path="/freestyle" element={<AdminFreestyleScreen />} />
      <Route path="*" element={<Navigate to="/admin/home" />} />
    </Routes>
  );
}

function AdminHomeScreen() {
  useEffect(() => {
    setRoute("admin/home");
  }, []);
  return <div>Home</div>;
}
function AdminUsersScreen() {
  useEffect(() => {
    setRoute("admin/users");
  }, []);
  return <div>Users</div>;
}
function AdminGroupsScreen() {
  useEffect(() => {
    setRoute("admin/groups");
  }, []);
  return <div>Groups</div>;
}
function AdminFreestyleScreen() {
  useEffect(() => {
    setRoute("admin/freestyle");
  }, []);
  return <div>Freestyle</div>;
}
