import { clearUser } from "@myjumpdata/redux";

export default function Logout() {
  clearUser();
  window.location.href = "/login";
}
