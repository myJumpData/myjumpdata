import { LANGUAGES } from "../Constants";

export function getLang() {
  let lngs: string[] = [];
  if (navigator.languages) {
    for (let i = 0; i < navigator.languages.length; i++) {
      lngs.push(navigator.languages[i]);
    }
  }
  if (navigator["userLanguage"]) {
    lngs.push(navigator["userLanguage"]);
  }
  if (navigator.language) {
    lngs.push(navigator.language);
  }
  lngs = lngs.map((e) => e.split("-")[0]);
  lngs = lngs.map((e) => (e === "uk" ? "ua" : e));
  lngs = [...new Set(lngs)];
  const filter = lngs.filter((e) => LANGUAGES.some((i) => i === e));
  return filter[0];
}
