import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Flag from "react-world-flags";
import AuthVerify from "../../common/AuthVerify";
import AdminActionBar from "../../components/AdminActionBar";
import Breadcrumb from "../../components/Breadcrumb";
import { TextInputInline } from "../../components/Input";
import { LANGUAGES } from "../../Constants";
import { setRoute } from "../../redux/route.action";
import {
  deleteFreestyle,
  getFreestyleElement,
  updateFreestyleElementLevel,
} from "../../service/freestyle.service";
import { HiTrash } from "react-icons/all";
import Button from "../../components/Button";

export default function AdminFreestyleElementScreen() {
  useEffect(() => {
    setRoute("admin/freestyle");
    AuthVerify({
      isAdmin: true,
    });
  }, []);
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [freestyleElementData, setFreestyleElementData] = useState<
    | {
        id: string;
        key: string;
        translation: any;
        compiled: boolean;
        level: string;
        groups: { _id: string; key: string; parent: string }[];
      }
    | undefined
  >();
  const [del, setDel] = useState(false);

  useEffect(() => {
    getFreestyleElement(params.id as string).then((response: any) => {
      if (response.key === "error.freestyle.notfound") {
        navigate("/admin/freestyle");
      } else {
        setFreestyleElementData(response.data);
      }
    });
  }, [navigate, params.id]);

  return (
    <>
      <AdminActionBar
        text={`${t<string>("common:nav_freestyle")}${
          freestyleElementData
            ? ` - ${freestyleElementData.key
                .split("_")
                .map((item) => t<string>(`freestyle:${item}`))
                .join(" ")}`
            : ""
        }`}
        actions={[
          {
            icon: HiTrash,
            onClick: () => {
              setDel(true);
            },
          },
        ]}
      />
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
                <td>
                  <TextInputInline
                    inputName="elementName"
                    value={freestyleElementData.level}
                    onSubmit={(value) => {
                      updateFreestyleElementLevel(
                        freestyleElementData.id,
                        value
                      ).then(() => {
                        getFreestyleElement(params.id as string).then(
                          (response) => {
                            setFreestyleElementData(response.data);
                          }
                        );
                      });
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td className="font-bold">Compiled</td>
                <td>{freestyleElementData.compiled ? "true" : "false"}</td>
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
      <DelOverlay />
    </>
  );

  function DelOverlay() {
    const navigate = useNavigate();

    return (
      <div
        className={
          "top-0 left-0 flex h-full w-full flex-col justify-center p-4 backdrop-blur backdrop-filter " +
          (del ? "fixed z-50" : "z-0 hidden")
        }
        onClick={() => {
          setDel(false);
        }}
      >
        <div className="mx-auto flex max-w-prose flex-col space-y-4 rounded-lg bg-gray-300/75 p-4 dark:bg-gray-600/75">
          <span className="text-xl font-bold">
            Are you sure you want to delete this Freestyle?
          </span>
          <Button
            name="Delete"
            design="danger"
            onClick={() => {
              if (freestyleElementData) {
                deleteFreestyle(freestyleElementData.id).then((response) => {
                  if (response.status === 200) {
                    setDel(false);
                    navigate("/admin/freestyle/");
                  }
                });
              }
            }}
          />
        </div>
      </div>
    );
  }
}
