import { clearUser } from "@myjumpdata/redux";

export default function Logout() {
  clearUser();
  setTimeout(() => {
    window.location.href = "/login";
  }, 500);
}
