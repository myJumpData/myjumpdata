import { clearUser } from "@myjumpdata/store";

export default function Logout() {
  clearUser();
  window.location.href = "/login";
}
