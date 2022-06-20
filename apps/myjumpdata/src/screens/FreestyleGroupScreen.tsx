import classNames from "classnames";
import i18next from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoFilter, IoGrid } from "react-icons/all";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import AuthVerify from "../common/AuthVerify";
import Breadcrumb from "../components/Breadcrumb";
import { Check, Element, Folder } from "../components/Freestyle";
import { SelectInput } from "../components/Input";
import Spinner from "../components/Spinner";
import useBreakpoint from "../hooks/useBreakpoint";
import { setRoute } from "../redux/route.action";
import { setViewAuto, setViewGrid, setViewList } from "../redux/view.action";
import { getFreestyle, getUserFreestyle } from "../service/freestyle.service";
import { getGroup } from "../service/groups.service";
import { freestyle_folder_data } from "../types/freestyle_folder_data";
import { capitalize } from "../utils/capitalize";
import fullname from "../utils/fullname";

export default function FreestyleGroupScreen() {
  useEffect(() => {
    setRoute("group");
    AuthVerify();
    i18next.loadNamespaces("freestyle").then(() => {
      setLoaded(true);
    });
  }, []);

  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const freestyle = params.freestyle || "";
  const breakpoint = useBreakpoint();
  const view = useSelector((state: any) => state.view);

  const {
    isFetching: freestyle_isFetching,
    isSuccess: freestyle_isSuccess,
    data: freestyle_data,
    refetch: freestyle_refetch,
  } = useQuery(["freestyle", freestyle], async () => {
    return await getFreestyle(freestyle);
  });

  const [loaded, setLoaded] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [userSelect, setUserSelect] = useState([]);
  const [userSelected, setUserSelected] = useState("");

  const {
    isFetching: freestyle_user_isFetching,
    isSuccess: freestyle_user_isSuccess,
    data: freestyle_user_data,
    refetch: freestyle_user_refetch,
  } = useQuery(
    ["freestyle_user", freestyle, freestyle_data, view, userSelected],
    async () => {
      return await getUserFreestyle(
        breakpoint === "xs" ||
          breakpoint === "sm" ||
          breakpoint === "md" ||
          view === "grid"
          ? userSelected === ""
            ? []
            : [userSelected]
          : userSelect.map((e: any) => e.value),
        freestyle_data?.data.map((e: any) => e.id)
      );
    }
  );

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

  if (!loaded) {
    return <Outlet />;
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
                setViewList();
              }}
              className={classNames(
                "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-lg font-bold",
                { "bg-white/50 text-yellow-500": view === "list" }
              )}
            >
              <IoFilter />
            </span>
            <span
              onClick={() => {
                setViewGrid();
              }}
              className={classNames(
                "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg p-2 text-lg font-bold",
                { "bg-white/50 text-yellow-500": view === "grid" }
              )}
            >
              <IoGrid />
            </span>
            <span
              onClick={() => {
                setViewAuto();
              }}
              className={classNames(
                "flex h-8 cursor-pointer items-center justify-center rounded-lg px-2 text-sm font-bold leading-none",
                { "bg-white/50 text-yellow-500": view === "auto" }
              )}
            >
              AUTO
            </span>
          </div>
        ) : null}
      </div>
      {breakpoint === "xs" ||
      breakpoint === "sm" ||
      breakpoint === "md" ||
      view === "grid" ? (
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
        isRefreshing={freestyle_isFetching || freestyle_user_isFetching}
        refresh={() => {
          freestyle_refetch();
          freestyle_user_refetch();
        }}
      />
      {freestyle_isSuccess ? (
        (view === "auto" &&
          (breakpoint === "xs" ||
            breakpoint === "sm" ||
            breakpoint === "md")) ||
        view === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {freestyle_data?.data?.map((e: freestyle_folder_data) => {
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
                      freestyle_user_isSuccess
                        ? freestyle_user_data?.data.find(
                            (i) => i.element === e.id && i.user === userSelected
                          ) || {}
                        : null
                    }
                    onRefresh={freestyle_user_refetch}
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
            <table>
              <thead>
                <tr className="border-b border-gray-500/50">
                  <th></th>
                  {freestyle_data?.data?.filter((i) => i.element).length > 0
                    ? userSelect?.map(({ name }: { name: string }, index) => {
                        return (
                          <th
                            key={index}
                            className="rotate-180 p-2 [writing-mode:vertical-lr]"
                          >
                            {name}
                          </th>
                        );
                      })
                    : null}
                </tr>
              </thead>
              <tbody>
                {freestyle_data?.data?.map(
                  (e: freestyle_folder_data, index) => {
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
                          {freestyle_data?.data?.filter((i) => i.element)
                            .length > 0
                            ? userSelect?.map(({ value }: any) => {
                                const el = freestyle_user_data?.data?.find(
                                  (i: any) =>
                                    i.user === value && i.element === e.id
                                );
                                return (
                                  <th>
                                    <Check
                                      user={value}
                                      elementId={e.id}
                                      stateCoach={
                                        userSelect
                                          ? el?.stateCoach || false
                                          : undefined
                                      }
                                      stateUser={
                                        userSelect
                                          ? el?.stateUser || false
                                          : undefined
                                      }
                                      onRefresh={freestyle_user_refetch}
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
                            navigate(
                              "/freestyle/group/" + params.id + "/" + e.key
                            );
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
                  }
                )}
              </tbody>
            </table>
          </>
        )
      ) : (
        <div className="flex justify-center">
          <span className="h-48">
            <Spinner />
          </span>
        </div>
      )}
    </>
  );
}
