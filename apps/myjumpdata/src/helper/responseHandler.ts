import { AxiosResponse } from 'axios';
import i18next from 'i18next';
import store from '../store/store';

export default async function ResponseHandler(
  res: AxiosResponse<any, any> | undefined | Promise<any>
) {
  const response = await res;
  const message_key: string = response?.data?.message?.key;
  const message_text: string =
    message_key && i18next.exists(message_key)
      ? i18next.t(message_key)
      : response?.data?.message?.text;

  store.dispatch({
    type: 'message/setMessage',
    payload: { text: message_text },
  });

  return {
    status: response?.status,
    message: message_text,
    key: message_key,
    data: response?.data?.data,
  } as { status: number; message: string; key: string; data: any };
}
