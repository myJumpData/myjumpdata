import { setFreestyle, setRoute } from "@myjumpdata/redux";
import { getFreestyle } from "@myjumpdata/service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFolder, FaFolderPlus, FaPlus } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthVerify from "../common/AuthVerify";
import Breadcrumb from "../components/Breadcrumb";

export default function AdminScreen() {
  AuthVerify();
  const user = useSelector((state: any) => state.freestyle);
  if (user.roles?.includes("admin")) {
    return <Navigate to="/" />;
  }
  return (
    <Routes>
      <Route path="/home" element={<AdminHomeScreen />} />
      <Route path="/users" element={<AdminUsersScreen />} />
      <Route path="/groups" element={<AdminGroupsScreen />} />
      <Route path="/freestyle" element={<AdminFreestyleScreen />} />
      <Route path="/localization" element={<AdminLocalizationScreen />} />
      <Route path="*" element={<Navigate to="/admin/home" />} />
    </Routes>
  );
}

function AdminHomeScreen() {
  useEffect(() => {
    setRoute("admin/home");
  }, []);
  AuthVerify();
  const user = useSelector((state: any) => state.freestyle);
  if (user.roles?.includes("admin")) {
    return <Navigate to="/" />;
  }

  return <div>Home</div>;
}
function AdminUsersScreen() {
  useEffect(() => {
    setRoute("admin/users");
  }, []);
  AuthVerify();
  const user = useSelector((state: any) => state.freestyle);
  if (user.roles?.includes("admin")) {
    return <Navigate to="/" />;
  }

  return <div>Users</div>;
}
function AdminGroupsScreen() {
  useEffect(() => {
    setRoute("admin/groups");
  }, []);
  AuthVerify();
  const user = useSelector((state: any) => state.freestyle);
  if (user.roles?.includes("admin")) {
    return <Navigate to="/" />;
  }

  return <div>Groups</div>;
}

type freestyle_folder_data = {
  id: string;
  key: string;
  back?: boolean;
  level?: string;
  group?: boolean;
  element?: boolean;
  compiled?: boolean;
};
function AdminFreestyleScreen() {
  useEffect(() => {
    setRoute("admin/freestyle");
  }, []);
  AuthVerify();
  const user = useSelector((state: any) => state.freestyle);
  const freestyle = useSelector((state: any) => state.freestyle);
  const [folderData, setFolderData] = useState<freestyle_folder_data[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    getFreestyle(freestyle).then((response: any) => {
      setFolderData(response.data);
    });
  }, [freestyle]);

  if (user.roles?.includes("admin")) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="w-full space-y-2">
        <span className="font-bold text-xl">
          {t("common:action:freestyle")}
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
          </tr>
        </thead>
        <tbody>
          {folderData?.map((e: freestyle_folder_data) => (
            <tr
              className="border-y border-gray-500 hover:bg-gray-500/50 cursor-pointer h-6"
              onClick={() => {
                if (e.element) {
                  return;
                } else if (e.back) {
                  setFreestyle(e.key);
                } else {
                  setFreestyle(e.key);
                }
              }}
            >
              {e.element ? (
                <>
                  <td></td>
                  <td>
                    {e.compiled
                      ? e.key
                          .split("_")
                          .map((item) => t(`freestyle:${item}`))
                          .join(" ")
                      : t(`freestyle:${e.key}`)}
                  </td>
                  <td>{e.compiled ? e.key.split("_").join(" ") : e.key}</td>
                  <td className="text-right">{e.level && `Lvl. ${e.level}`}</td>
                </>
              ) : e.back ? (
                <>
                  <td>
                    <HiArrowLeft />
                  </td>
                  <td>{t("common:back")}</td>
                  <td></td>
                  <td></td>
                </>
              ) : (
                <>
                  <td>
                    <FaFolder />
                  </td>
                  <td>
                    {t(
                      `freestyle:${
                        e.key.split("_")[e.key.split("_").length - 1]
                      }`
                    )}
                  </td>
                  <td>{e.key.split("_")[e.key.split("_").length - 1]}</td>
                  <td></td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function AddBottom() {
  return (
    <div className="rounded-lg bg-gray-500/50 flex h-12 items-center px-4 py-2 space-x-4 justify-end">
      <div className="opacity-50 hover:opacity-100 hover:scale-125 transition">
        <FaPlus className="text-lg" />
      </div>
      <div className="opacity-50 hover:opacity-100 hover:scale-125 transition">
        <FaFolderPlus className="text-lg" />
      </div>
    </div>
  );
}

function AdminLocalizationScreen() {
  useEffect(() => {
    setRoute("admin/localization");
  }, []);
  AuthVerify();
  const user = useSelector((state: any) => state.freestyle);
  if (user.roles?.includes("admin")) {
    return <Navigate to="/" />;
  }

  return <div>Localization</div>;
}
