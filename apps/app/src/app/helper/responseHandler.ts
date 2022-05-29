import { AxiosResponse } from "axios";
import i18next from "i18next";
import { ToastAndroid } from "react-native";
import { clearUser } from "../redux/user.action";

export interface responseHandlerType {
  status: number;
  message: string;
  key: string;
  data: any;
}

export default async function responseHandler(
  res: AxiosResponse | Promise<any>
) {
  const response = await res;
  const message_key: string = response?.data?.message?.key;
  const message_text: string =
    message_key && i18next.exists(message_key)
      ? i18next.t(message_key)
      : response?.data?.message?.text;

  if (message_text) {
    ToastAndroid.show(message_text, ToastAndroid.SHORT);
  }

  if (message_key === "unauthorized.accesstoken") {
    clearUser();
    return;
  }

  return {
    status: response?.status,
    message: message_text,
    key: message_key,
    data: response?.data?.data,
  } as responseHandlerType;
}
