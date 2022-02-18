import { LANGUAGES } from "@myjumpdata/const";
import { setRoute } from "@myjumpdata/redux";
import {
  getFreestyle,
  getFreestyleElement,
  getUsers,
} from "@myjumpdata/service";
import { classNames } from "@myjumpdata/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFolder, FaFolderPlus, FaPlus } from "react-icons/fa";
import { HiArrowLeft, HiArrowRight, HiCheck, HiX } from "react-icons/hi";
import { useSelector } from "react-redux";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import ReactTooltip from "react-tooltip";
import Flag from "react-world-flags";
import AuthVerify from "../common/AuthVerify";
import Breadcrumb from "../components/Breadcrumb";
import Table from "../components/Table";

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
      <Route path="/freestyle">
        <Route index element={<AdminFreestyleScreen />} />
        <Route path="element/:id" element={<AdminFreestyleElementScreen />} />
      </Route>
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
  const [usersData, setUsersData] = useState<
    | {
        items: number;
        data: any[];
        page: number;
        pages: number;
        count: number;
      }
    | undefined
  >();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const { t } = useTranslation();

  useEffect(() => {
    getUsers(page, limit).then((response) => {
      console.log(response.data);
      response.data.data = response.data.data.map((item) => {
        item.picture = item.picture ? (
          <div className="m-1 h-8 w-8">
            <img
              className="h-full w-full rounded-full object-contain"
              height="3rem"
              width="3rem"
              src={item.picture}
              alt={item.username}
            />
          </div>
        ) : (
          <div className="m-1 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 font-bold text-black">
            {(item.firstname[0] + item.lastname[0]).toUpperCase()}
          </div>
        );
        item.active = (
          <span
            className={classNames(
              "flex w-full items-center justify-center text-2xl",
              item.active ? "text-green-500" : "text-red-500"
            )}
          >
            {item.active ? <HiCheck /> : <HiX />}
          </span>
        );
        item.roles = (
          <div className="flex flex-row space-x-1">
            {item.roles.map((role) => (
              <>
                {" "}
                <span
                  className={classNames(
                    "flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg border-2 text-sm",
                    role === "athlete" && "border-orange-500",
                    role === "coach" && "border-blue-500",
                    role === "admin" && "border-red-500"
                  )}
                  data-for={role}
                  data-tip={role}
                >
                  {role[0].toUpperCase()}
                </span>
                <ReactTooltip id={role} effect="solid" />
              </>
            ))}
          </div>
        );
        return item;
      });
      setUsersData(response.data);
    });
  }, [page, limit]);

  if (user.roles?.includes("admin")) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="w-full space-y-2">
        <span className="text-xl font-bold">{t("common:nav_users")}</span>
      </div>

      <Table
        page={page}
        pages={usersData?.pages || 0}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        total={usersData?.items || 0}
        structure={[
          { name: "", key: "picture" },
          { name: "ID", key: "id", options: { align: "text-left" } },
          {
            name: "Username",
            key: "username",
            options: { align: "text-left" },
          },
          {
            name: "Firstname",
            key: "firstname",
            options: { align: "text-left" },
          },
          {
            name: "Lastname",
            key: "lastname",
            options: { align: "text-left" },
          },
          { name: "Email", key: "email", options: { align: "text-left" } },
          { name: "Active", key: "active", options: { align: "text-center" } },
          { name: "Roles", key: "roles", options: { align: "text-left" } },
        ]}
        data={usersData?.data}
      />
    </>
  );
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
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.freestyle);
  const [folderData, setFolderData] = useState<freestyle_folder_data[]>([]);
  const [freestyle, setFreestyle] = useState<string>("");
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
        <span className="text-xl font-bold">{t("common:nav_freestyle")}</span>
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
                      : t(`freestyle:${e.key}`)}
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
                  <td>{t("common:back")}</td>
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
                    {t(
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

function AdminFreestyleElementScreen() {
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
  useEffect(() => {
    getFreestyleElement(params.id as string).then((response) => {
      setFreestyleElementData(response.data);
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
                <td>{freestyleElementData.level}</td>
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
                    .map((item) => freestyleElementData.translation[lang][item])
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
