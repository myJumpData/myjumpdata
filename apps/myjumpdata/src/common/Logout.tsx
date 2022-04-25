import { clearUser } from "../redux/user.action";

export default function Logout() {
  clearUser();
  setTimeout(() => {
    window.location.href = "/login";
  }, 500);
}
