import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import AuthVerify from "../common/AuthVerify";
import Breadcrumb from "../components/Breadcrumb";
import { Back, Element, Folder } from "../components/Freestyle";
import { SelectInput } from "../components/Input";
import { setRoute } from "../redux/route.action";
import {
  getFreestyle,
  getFreestyleData,
  saveFreestyleData,
} from "../service/freestyle.service";
import { getClub, getGroup } from "../service/groups.service";
import { capitalize } from "../utils/capitalize";
import fullname from "../utils/fullname";
import useBreakpoint from "../hooks/useBreakpoint";
import Spinner from "../components/Spinner";
import { FaRegCheckSquare, FaRegSquare, FaSquare } from "react-icons/fa";
import { classNames } from "../utils/classNames";
import { IoFilter, IoGrid } from "react-icons/all";

type freestyle_folder_data = {
  id: string;
  key: string;
  back?: boolean;
  level?: string;
  group?: boolean;
  element?: boolean;
  compiled?: boolean;
  club?: string;
  set?: boolean;
};

export default function FreestyleGroupScreen() {
  useEffect(() => {
    setRoute("group");
    AuthVerify();
  }, []);
  const params = useParams();

  const [groupName, setGroupName] = useState("");
  const [userSelect, setUserSelect] = useState([]);
  const [userSelected, setUserSelected] = useState("");

  const freestyle = params.freestyle || "";

  const [freestyleDataUser, setFreestyleDataUser] = useState<any[]>([]);
  const [freestyleDataUsers, setFreestyleDataUsers] = useState<any>({});
  const [folderData, setFolderData] = useState<freestyle_folder_data[]>([]);
  const [view, setView] = useState<"grid" | "list" | "auto">("auto");

  const { t } = useTranslation();
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();

  useEffect(() => {
    getGroup(params.id as string).then((response: any) => {
      setGroupName(response.data?.name);
      const tmp = response.data?.athletes.map((e) => {
        return {
          name: capitalize(fullname(e)),
          value: e.id,
        };
      });
      setUserSelect(tmp);
      setUserSelected(tmp[0].value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    (async () => {
      await getUserData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelected, breakpoint, userSelect]);

  function getCurrentData() {
    getFreestyle(freestyle).then((response: any) => {
      setFolderData(response.data);
    });
  }

  useEffect(() => {
    getCurrentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freestyle, breakpoint]);

  function getUserData() {
    getClub().then((response) => {
      if (!response.data) {
        navigate(-1);
      }
    });
    if (breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md") {
      if (userSelected) {
        return getFreestyleData(userSelected).then((response: any) => {
          setFreestyleDataUser(response.data);
          return Promise.resolve();
        });
      }
      return Promise.resolve();
    } else {
      const list = userSelect?.map((value: any) => {
        return getFreestyleData(value.value).then((response: any) => {
          return response.data;
        });
      });
      Promise.all(list).then((res) => {
        setFreestyleDataUsers(res.flat());
      });
      return Promise.resolve();
    }
  }

  return (
    <>
      <div className="flex w-full items-center justify-between space-y-2">
        <span className="text-xl font-bold">
          {t("freestyle_title") + " " + groupName}
        </span>
        {breakpoint !== "xs" && breakpoint !== "sm" ? (
          <div className="flex h-12 items-center justify-center space-x-2 rounded-lg bg-gray-500/50 px-2 text-gray-500/50">
            <span
              onClick={() => {
                setView("list");
              }}
              className={classNames(
                "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-lg font-bold",
                view === "list" ? "bg-white/50 text-yellow-500" : ""
              )}
            >
              <IoFilter />
            </span>
            <span
              onClick={() => {
                setView("grid");
              }}
              className={classNames(
                "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg p-2 text-lg font-bold",
                view === "grid" ? "bg-white/50 text-yellow-500" : ""
              )}
            >
              <IoGrid />
            </span>
            <span
              onClick={() => {
                setView("auto");
              }}
              className={classNames(
                "flex h-8 cursor-pointer items-center justify-center rounded-lg px-2 text-sm font-bold leading-none",
                view === "auto" ? "bg-white/50 text-yellow-500" : ""
              )}
            >
              AUTO
            </span>
          </div>
        ) : null}
      </div>
      {breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md" ? (
        <div className="mb-2 flex items-center space-x-2">
          <div className="w-full">
            <SelectInput
              options={userSelect}
              current={userSelected}
              stateChange={setUserSelected}
            />
          </div>
        </div>
      ) : null}
      <Breadcrumb
        data={freestyle ? freestyle.split("_") : []}
        setState={(e) => {
          navigate("/freestyle/group/" + params.id + "/" + e);
        }}
      />

      {(view === "auto" &&
        (breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md")) ||
      view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {folderData?.map((e: freestyle_folder_data) => {
            if (e.element) {
              return (
                <Element
                  user={userSelected}
                  name={e.key}
                  level={e.level}
                  key={e.key}
                  id={e.id}
                  compiled={e.compiled}
                  element={
                    freestyleDataUser?.find((i) => i.element === e.id) || {}
                  }
                  onRefresh={() => {
                    return getUserData();
                  }}
                />
              );
            } else if (e.back) {
              return (
                <Back
                  to={e.key}
                  key="back"
                  state={(e) => {
                    navigate("/freestyle/group/" + params.id + "/" + e);
                  }}
                />
              );
            } else {
              return (
                <Folder
                  key={e.key}
                  set={e.set}
                  name={e.key}
                  onClick={(e) => {
                    navigate("/freestyle/group/" + params.id + "/" + e);
                  }}
                />
              );
            }
          })}
        </div>
      ) : (
        <>
          <Back
            to={folderData?.find((i) => i.back)?.key || ""}
            key="back"
            state={(e) => {
              navigate("/freestyle/group/" + params.id + "/" + e);
            }}
          />
          <table>
            <thead>
              <tr className="border-b border-gray-500/50">
                <th></th>
                {folderData?.filter((i) => i.element).length > 0
                  ? userSelect?.map(({ name }: { name: string }) => {
                      return (
                        <th className="rotate-180 p-2 [writing-mode:vertical-lr]">
                          {name}
                        </th>
                      );
                    })
                  : null}
              </tr>
            </thead>
            <tbody>
              {folderData?.map((e: freestyle_folder_data, index) => {
                if (e.element) {
                  return (
                    <tr className="border-b border-gray-500/50" key={index}>
                      <td className="flex cursor-pointer flex-col py-2">
                        <span className="text-lg font-bold leading-none">
                          {e.compiled
                            ? e.key
                                .split("_")
                                .map((item) => t(`freestyle:${item}`))
                                .join(" ")
                            : t(`freestyle:${e.key}`)}
                        </span>
                        {e.level ? (
                          <span className="text-sm leading-none opacity-75">
                            Lvl. {e.level}
                          </span>
                        ) : null}
                      </td>
                      {folderData?.filter((i) => i.element).length > 0
                        ? userSelect?.map(({ value }: any) => {
                            if (!freestyleDataUsers) {
                              return null;
                            }
                            const el = freestyleDataUsers?.find(
                              (i: any) => i.user === value && i.element === e.id
                            );
                            return (
                              <th>
                                <Check
                                  user={value}
                                  elementId={e.id}
                                  stateCoach={
                                    !userSelect
                                      ? undefined
                                      : el?.stateCoach || false
                                  }
                                  stateUser={
                                    !userSelect
                                      ? undefined
                                      : el?.stateUser || false
                                  }
                                  onRefresh={getUserData}
                                />
                              </th>
                            );
                          })
                        : null}
                    </tr>
                  );
                } else if (e.group) {
                  return (
                    <tr
                      className="cursor-pointer border-b border-gray-500/50"
                      key={index}
                      onClick={() => {
                        navigate("/freestyle/group/" + params.id + "/" + e.key);
                      }}
                    >
                      <td className="flex cursor-pointer flex-col py-2">
                        <span className="text-lg font-bold leading-none">
                          {t(`freestyle:${e.key.split("_").at(-1)}`)}
                        </span>
                        {e.set ? (
                          <span className="text-sm leading-none opacity-75">
                            {e.set ? "set" : null}
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

function Check({ user, elementId, stateCoach, stateUser, onRefresh }) {
  const [reloading, setReloading] = useState(false);

  return (
    <div
      onClick={() => {
        setReloading(true);
        saveFreestyleData(user, elementId as string, !stateCoach).then(() => {
          onRefresh().then(() => {
            setReloading(false);
          });
        });
      }}
    >
      <span className="ml-2 flex items-center justify-center self-end py-2 xs:self-center xs:text-2xl">
        {reloading || (stateUser === undefined && stateCoach === undefined) ? (
          <Spinner />
        ) : stateCoach ? (
          <FaSquare />
        ) : stateUser ? (
          <FaRegCheckSquare />
        ) : (
          <FaRegSquare />
        )}
      </span>
    </div>
  );
}
