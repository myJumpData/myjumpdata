import { clearUser } from "../store/user.action";

export default function Logout() {
  clearUser();
  window.location.href = "/login";
}
