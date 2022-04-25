import i18next from "i18next";
import { setMessage } from "../redux/message.action";

export default async function responseHandler(res) {
  const response = await res;
  const message_key = response?.data?.message?.key;
  const message_text =
    message_key && i18next.exists(message_key)
      ? i18next.t(message_key)
      : response?.data?.message?.text;

  setMessage({ text: message_text });

  return {
    status: response?.status,
    message: message_text,
    key: message_key,
    data: response?.data?.data,
  };
}
