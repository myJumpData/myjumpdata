import AuthService from "../services/auth.service";

export default function Logout() {
  AuthService.logout();
  window.location.href = "/login";
}
