import { setRoute } from "@myjumpdata/redux";
import { getFreestyle } from "@myjumpdata/service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFolder, FaFolderPlus, FaPlus } from "react-icons/fa";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import AuthVerify from "../../common/AuthVerify";
import Breadcrumb from "../../components/Breadcrumb";

type freestyle_folder_data = {
  id: string;
  key: string;
  back?: boolean;
  level?: string;
  group?: boolean;
  element?: boolean;
  compiled?: boolean;
};

export default function AdminFreestyleScreen() {
  useEffect(() => {
    setRoute("admin/freestyle");
    AuthVerify({
      isAdmin: true,
    });
  }, []);
  const navigate = useNavigate();
  const [folderData, setFolderData] = useState<freestyle_folder_data[]>([]);
  const [freestyle, setFreestyle] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    getFreestyle(freestyle).then((response: any) => {
      setFolderData(response.data);
    });
  }, [freestyle]);

  return (
    <>
      <div className="w-full space-y-2">
        <span className="text-xl font-bold">
          {t<string>("common:nav_freestyle")}
        </span>
      </div>
      <Breadcrumb
        data={freestyle ? freestyle.split("_") : []}
        setState={setFreestyle}
      />
      <table>
        <thead>
          <tr className="text-left">
            <th className="w-6"></th>
            <th>Name</th>
            <th>Key</th>
            <th className="text-right">Level</th>
            <th className="w-6"></th>
          </tr>
        </thead>
        <tbody>
          {folderData?.map((e: freestyle_folder_data) => {
            if (e.element) {
              return (
                <tr
                  className="h-6 cursor-pointer border-y border-gray-500 transition-all duration-1000 ease-out hover:h-8 hover:bg-gray-500/50 hover:duration-500"
                  key={e.key}
                  onClick={() => {
                    navigate("/admin/freestyle/element/" + e.id);
                  }}
                >
                  <td></td>
                  <td>
                    {e.compiled
                      ? e.key
                          .split("_")
                          .map((item) => t(`freestyle:${item}`))
                          .join(" ")
                      : t<string>(`freestyle:${e.key}`)}
                  </td>
                  <td>{e.compiled ? e.key.split("_").join(" ") : e.key}</td>
                  <td className="text-right">{e.level && `Lvl. ${e.level}`}</td>
                  <td>
                    <HiArrowRight />
                  </td>
                </tr>
              );
            }
            if (e.back) {
              return (
                <tr
                  className="h-6 cursor-pointer border-y border-gray-500 transition-all duration-1000 ease-out hover:h-8 hover:bg-gray-500/50 hover:duration-500"
                  key={e.key}
                  onClick={() => {
                    setFreestyle(e.key);
                  }}
                >
                  <td>
                    <HiArrowLeft />
                  </td>
                  <td>{t<string>("common:back")}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              );
            }
            if (e.group) {
              return (
                <tr
                  className="h-6 cursor-pointer border-y border-gray-500 transition-all duration-1000 ease-out hover:h-8  hover:bg-gray-500/50 hover:duration-500"
                  key={e.key}
                  onClick={() => {
                    setFreestyle(e.key);
                  }}
                >
                  <td>
                    <FaFolder />
                  </td>
                  <td>
                    {t<string>(
                      `freestyle:${
                        e.key.split("_")[e.key.split("_").length - 1]
                      }`
                    )}
                  </td>
                  <td>{e.key.split("_")[e.key.split("_").length - 1]}</td>
                  <td></td>
                  <td></td>
                </tr>
              );
            }
            return <span key={e.key}></span>;
          })}
        </tbody>
      </table>
    </>
  );
  function AddBottom() {
    return (
      <div className="flex h-12 items-center justify-end space-x-4 rounded-lg bg-gray-500/50 px-4 py-2">
        <div className="opacity-50 transition hover:scale-125 hover:opacity-100">
          <FaPlus className="text-lg" />
        </div>
        <div className="opacity-50 transition hover:scale-125 hover:opacity-100">
          <FaFolderPlus className="text-lg" />
        </div>
      </div>
    );
  }
}
