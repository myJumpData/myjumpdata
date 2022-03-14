import { LANGUAGES } from "@myjumpdata/const";
import { setRoute } from "@myjumpdata/redux";
import {
  getFreestyleElement,
  updateFreestyleElementLevel,
} from "@myjumpdata/service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { useParams } from "react-router-dom";
import Flag from "react-world-flags";
import AuthVerify from "../../common/AuthVerify";
import Breadcrumb from "../../components/Breadcrumb";

export default function AdminFreestyleElementScreen() {
  useEffect(() => {
    setRoute("admin/freestyle");
    AuthVerify({
      isAdmin: true,
    });
  }, []);
  const params = useParams();
  const { t } = useTranslation();
  const [freestyleElementData, setFreestyleElementData] = useState<
    | {
        id: string;
        key: string;
        translation: any;
        level: string;
        groups: { _id: string; key: string; parent: string }[];
      }
    | undefined
  >();
  const [elementLevel, setElementLevel] = useState<string | undefined>();

  useEffect(() => {
    getFreestyleElement(params.id as string).then((response) => {
      setFreestyleElementData(response.data);
      setElementLevel(response.data.level);
    });
  }, [params.id]);

  return (
    <>
      <div className="w-full space-y-2">
        <span className="text-xl font-bold">
          {t("common:nav_freestyle")}
          {freestyleElementData &&
            ` - ${freestyleElementData.key
              .split("_")
              .map((item) => t(`freestyle:${item}`))
              .join(" ")}`}
        </span>
      </div>
      {freestyleElementData && (
        <>
          <table>
            <tbody>
              <tr>
                <td className="font-bold">id</td>
                <td>{freestyleElementData.id}</td>
              </tr>
              <tr>
                <td className="font-bold">key</td>
                <td>{freestyleElementData.key}</td>
              </tr>
              <tr>
                <td className="font-bold">level</td>
                <td className="cursor-text">
                  <div className="relative w-full">
                    <input
                      className="w-full border-b border-black bg-transparent focus:border-gray-500/50 focus:outline-0"
                      value={elementLevel}
                      onChange={(e) => {
                        setElementLevel(e.target.value);
                      }}
                    />
                    {elementLevel !== freestyleElementData.level && (
                      <>
                        <span
                          className="absolute top-0 right-5 cursor-pointer text-xl text-gray-500 hover:text-red-500"
                          onClick={() => {
                            setElementLevel(freestyleElementData.level);
                          }}
                        >
                          <HiXCircle />
                        </span>
                        <span
                          className="absolute top-0 right-0 cursor-pointer text-xl text-gray-500 hover:text-green-500"
                          onClick={() => {
                            updateFreestyleElementLevel(
                              freestyleElementData.id,
                              elementLevel
                            ).then(() => {
                              getFreestyleElement(params.id as string).then(
                                (response) => {
                                  setFreestyleElementData(response.data);
                                  setElementLevel(response.data.level);
                                }
                              );
                            });
                          }}
                        >
                          <HiCheckCircle />
                        </span>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <span className="font-bold">Groups</span>
            {freestyleElementData.groups.map((group) => (
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
                  {freestyleElementData.key
                    .split("_")
                    .map((item) => {
                      if (freestyleElementData.translation[lang]) {
                        return freestyleElementData.translation[lang][item];
                      }
                      return null;
                    })
                    .join(" ")}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
