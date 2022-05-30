import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Flag from "react-world-flags";
import AuthVerify from "../../common/AuthVerify";
import AdminActionBar from "../../components/AdminActionBar";
import { TextInputInline } from "../../components/Input";
import { LANGUAGES } from "../../Constants";
import { setRoute } from "../../redux/route.action";
import {
  getLocalization,
  updateLocalization,
} from "../../service/admin.service";

export default function AdminLocalizationUpdateScreen() {
  useEffect(() => {
    setRoute("admin/localization");
    AuthVerify({
      isAdmin: true,
    });
  }, []);

  const params = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [translations, setTranslations] = useState<any>({});

  function getData() {
    getLocalization(params.namespace as string, params.key as string).then(
      (res) => {
        setTranslations(res.data);
      }
    );
  }

  useEffect(() => {
    if (params.key && params.namespace) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.key, params.namespace]);

  return (
    <>
      <AdminActionBar
        text={`${t<string>("common:nav_localization")} - ${params.namespace}:${
          params.key
        } - Update`}
      />
      <div className="flex items-center">
        <span className="pr-2 font-bold">{params.namespace}:</span>
        <TextInputInline
          inputName="key"
          value={params.key || ""}
          onSubmit={(value) => {
            updateLocalization(
              // eslint-disable-next-line no-unused-vars
              Object.entries(translations).map(([_, data]: any) => {
                return data.id;
              }),
              {
                key: value,
              }
            ).then(() => {
              navigate(
                "/admin/localization/update/" + params.namespace + "/" + value
              );
              getData();
            });
          }}
        />
      </div>
      <div>
        <span className="font-bold">Translations</span>
        {LANGUAGES.map((lang) => {
          return (
            <div
              className="my-2 flex h-8 items-center space-x-2 overflow-hidden rounded-lg px-4 py-2"
              key={lang}
            >
              <span className="flex h-full w-12 items-center">
                <Flag code={lang === "en" ? "gb" : lang} />
              </span>

              <span className="w-full px-4 py-2">
                <TextInputInline
                  inputName={lang.toUpperCase()}
                  value={translations[lang]?.translation}
                  onSubmit={(value) => {
                    updateLocalization(
                      [translations[lang]?.id || "create"],
                      translations[lang]?.id
                        ? {
                            translation: value,
                          }
                        : {
                            language: lang,
                            namespace: params.namespace,
                            translation: value,
                            key: params.key,
                          }
                    ).then(() => {
                      getData();
                    });
                  }}
                />
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
