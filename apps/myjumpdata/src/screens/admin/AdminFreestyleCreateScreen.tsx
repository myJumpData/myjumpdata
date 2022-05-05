import AdminActionBar from "../../components/AdminActionBar";
import { TextInput } from "../../components/Input";
import Breadcrumb from "../../components/Breadcrumb";
import { LANGUAGES } from "../../Constants";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Flag from "react-world-flags";
import { useParams } from "react-router";
import { HiCheck } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import {
  createFreestyle,
  getFreestyleTranslation,
} from "../../service/admin.service";

export default function AdminFreestyleCreateScreen() {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();

  const [key, setKey] = useState("");
  const [level, setLevel] = useState("");
  const [translation, setTranslation] = useState<any>({});

  useEffect(() => {
    getFreestyleTranslation(key).then((res) => {
      setTranslation(res.data);
    });
  }, [key]);

  return (
    <>
      <AdminActionBar
        text={`${t<string>("common:nav_freestyle")} - Create`}
        actions={[
          {
            icon: HiCheck,
            onClick: () => {
              createFreestyle(key, level, [params.path as string]).then(
                (res: any) => {
                  if (res.key === "success.create.freestyle") {
                    navigate("/admin/freestyle");
                  }
                }
              );
            },
          },
        ]}
      />
      <div>
        <TextInput
          type="text"
          inputName="key"
          name="Key"
          value={key}
          stateChange={setKey}
        />
        <TextInput
          type="text"
          inputName="level"
          name="Level"
          value={level}
          stateChange={setLevel}
        />
      </div>
      <div>
        <span className="font-bold">Groups</span>
        {[{ key: params.path }].map((group: any) => (
          <div className="my-2" key={group.key}>
            <Breadcrumb
              data={group.key.split("_")}
              setState={() => {
                return;
              }}
            />
          </div>
        ))}
      </div>
      <div>
        <span className="font-bold">Translations</span>
        {LANGUAGES.map((lang) => (
          <div
            className="my-2 flex h-8 items-center space-x-2 overflow-hidden rounded-lg bg-gray-500/50 px-4 py-2"
            key={lang}
          >
            <span className="flex h-full w-12 items-center">
              <Flag code={lang === "en" ? "gb" : lang} />
            </span>

            <span className="px-4 py-2">
              {key
                .split("_")
                .map((item) => {
                  if (translation[lang]) {
                    return translation[lang][item];
                  }
                  return null;
                })
                .join(" ")}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
