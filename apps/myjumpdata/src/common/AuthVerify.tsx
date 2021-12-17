import TokenService from '../services/token.service';
import Logout from './Logout';
import { Buffer } from 'buffer';

export default function AuthVerify() {
  const token = TokenService.getLocalAccessToken();

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
