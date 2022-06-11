import { getLocales } from "react-native-localize";
import { LANGUAGES } from "../Constants";

export function getLang() {
  const all = getLocales();
  const map = all.map((item: any) => item.languageCode.toLowerCase());
  const filter = map.filter((e) => LANGUAGES.some((i) => i === e));
  return filter[0];
}
