import { Buffer } from 'buffer';
import TokenService from '../services/token.service';
import Logout from './Logout';

export default function AuthVerify() {
  const token = TokenService.getLocalAccessToken();
  const user = TokenService.getUser();
  console.log(user);
  if (user.active !== true) {
    Logout();
    return;
  }

  if (token) {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    const exp = payload.exp * 1000;
    const now = Date.now();
    if (exp > now) {
      return;
    }
  }
  Logout();
  return;
}
