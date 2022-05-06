import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Flag from "react-world-flags";
import AuthVerify from "../../common/AuthVerify";
import AdminActionBar from "../../components/AdminActionBar";
import Button from "../../components/Button";
import { TextInput } from "../../components/Input";
import { LANGUAGES } from "../../Constants";
import { setRoute } from "../../redux/route.action";
import { createLocalization } from "../../service/admin.service";

export default function AdminLocalizationCreateScreen() {
  useEffect(() => {
    setRoute("admin/localization");
    AuthVerify({
      isAdmin: true,
    });
  }, []);

  const params = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [key, setKey] = useState<string>("");
  const [translations, setTranslations] = useState<any>(
    Object.fromEntries(LANGUAGES.map((lang) => [lang, ""]))
  );

  return (
    <>
      <AdminActionBar
        text={`${t<string>("common:nav_localization")} - ${
          params.namespace
        } - Create`}
      />
      <div className="flex items-center">
        <span className="pr-2 pb-4 font-bold">{params.namespace}:</span>
        <TextInput type="text" name="key" stateChange={setKey} value={key} />
      </div>
      <div>
        <span className="font-bold">Translations</span>
        {LANGUAGES.map((lang) => (
          <div
            className="my-2 flex h-8 items-center space-x-2 overflow-hidden rounded-lg px-4 py-2"
            key={lang}
          >
            <span className="flex h-full w-12 items-center">
              <Flag code={lang === "en" ? "gb" : lang} />
            </span>

            <span className="w-full px-4 py-2">
              <TextInput
                type="text"
                name={lang.toUpperCase()}
                stateChange={(val) => {
                  setTranslations({ ...translations, [lang]: val });
                }}
                value={translations[lang]}
              />
            </span>
          </div>
        ))}
      </div>
      <Button
        name="Submit"
        design="success"
        onClick={() => {
          createLocalization(
            params.namespace as string,
            key,
            translations
          ).then((res: any) => {
            if (res.key === "success.create.localization") {
              navigate(-1);
            }
          });
        }}
      />
    </>
  );
}
