import { Buffer } from "buffer";
import { getUser } from "../store/user.action";
import Logout from "./Logout";

export default function AuthVerify() {
  const user = getUser();
  if (Object.keys(user).length === 0) {
    return Logout();
  }
  if (user.active !== true) {
    return Logout();
  }

  if (user.token) {
    const payload = JSON.parse(
      Buffer.from(user.token.split(".")[1], "base64").toString()
    );
    const exp = payload.exp * 1000;
    const now = Date.now();
    if (exp > now) {
      return;
    }
  }
  return Logout();
}
