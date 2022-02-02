import { Tab } from "@headlessui/react";
import { setFreestyle } from "@myjumpdata/redux";
import {
  getFreestyle,
  getFreestyleDataOwn,
  saveFreestyleDataOwn,
} from "@myjumpdata/service";
import { Dispatch, Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaCaretDown,
  FaCaretRight,
  FaRegCheckSquare,
  FaRegSquare,
  FaSquare,
} from "react-icons/fa";
import {
  HiArrowLeft,
  HiChevronRight,
  HiHome,
  HiOutlineHome,
  HiViewGrid,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import AuthVerify from "../common/AuthVerify";
import Wrapper from "../parts/Wrapper";

type freestyle_data_group_type = {
  name: string;
  elements?: freestyle_data_element_type[];
  groups?: freestyle_data_group_type[];
};
type freestyle_data_element_type = {
  name: string;
  level?: string;
};
type freestyle_data_type = {
  name: string;
  groups?: freestyle_data_group_type[];
};
type freestyle_folder_data = {
  id: string;
  key: string;
  back?: boolean;
  level?: string;
  group?: boolean;
  element?: boolean;
};
export default function FreestyleScreen() {
  AuthVerify();

  const freestyle = useSelector((state: any) => state.freestyle);

  const [freestyleData, setFreestyleData] = useState<freestyle_data_type[]>([]);
  const [freestyleDataOwn, setFreestyleDataOwn] = useState<any[]>([]);
  const [viewStyle, setViewStyle] = useState<"list" | "grid" | "board">("grid");
  const [folderData, setFolderData] = useState<freestyle_folder_data[]>([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    getCurrentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freestyle]);

  function readGroup(e: freestyle_data_group_type, id: string) {
    return e.groups?.map((e: freestyle_data_group_type) => {
      return (
        <Group
          name={e.name}
          key={e.name}
          onClick={() => {
            setFreestyle(id + "_" + e.name);
          }}
        >
          {e.elements && readElement(e)}
          {e.groups && readGroup(e, id + "_" + e.name)}
        </Group>
      );
    });
  }
  function readElement(e: freestyle_data_group_type) {
    return e.elements?.map((e: freestyle_data_element_type) => {
      return <Element name={e.name} key={e.name} level={e.level} />;
    });
  }

  function getUserData() {
    getFreestyleDataOwn().then((response: any) => {
      setFreestyleDataOwn(response.data);
    });
  }

  function getCurrentData() {
    getFreestyle(freestyle).then((response: any) => {
      setFreestyleData(response.data);
      setFolderData(response.data);
    });
  }

  return (
    <Wrapper current="freestyle">
      <div className="w-full space-y-2">
        <span className="font-bold text-xl">
          {t("common:action:freestyle")}
        </span>
      </div>
      <div className="flex mb-4 items-end">
        <div className="mr-auto">
          {viewStyle === "grid" && (
            <div className="flex h-full items-center bg-gray-200 dark:bg-gray-700 rounded-xl px-4 space-x-2 py-2 mr-2 flex-wrap">
              <span
                onClick={() => {
                  setFreestyle("");
                }}
                className="text-xl cursor-pointer"
              >
                {freestyle === "" ? <HiHome /> : <HiOutlineHome />}
              </span>

              {freestyle !== "" &&
                freestyle.split("_").map((e, index, array) => {
                  let last = false;
                  if (index + 1 === array.length) {
                    last = true;
                  }
                  return (
                    <span
                      className="inline-flex cursor-pointer"
                      key={index}
                      onClick={() => {
                        setFreestyle(
                          freestyle
                            .split("_")
                            .splice(0, index + 1)
                            .join("_")
                        );
                      }}
                    >
                      <HiChevronRight className="text-2xl" />
                      <span
                        className={"whitespace-nowrap " + (last && "font-bold")}
                      >
                        {i18n.exists(`freestyle:${e}`)
                          ? t(`freestyle:${e}`)
                          : e}
                      </span>
                    </span>
                  );
                })}
            </div>
          )}
        </div>
        <ViewSelect state={setViewStyle} />
      </div>

      {viewStyle === "list" || viewStyle === "board" ? (
        <div
          className={`${
            viewStyle === "list" && " flex flex-col max-w-prose mx-auto"
          } ${
            viewStyle === "board" &&
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          }`}
        >
          {freestyleData.map((e: freestyle_data_group_type) => (
            <Group
              name={e.name}
              key={e.name}
              uncollapsed
              cardStyle={viewStyle === "board" ? true : false}
              onClick={() => {
                setFreestyle(e.name);
              }}
            >
              {readGroup(e, e.name)}
            </Group>
          ))}
        </div>
      ) : (
        viewStyle === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {folderData?.map((e: freestyle_folder_data) => {
              if (e.element) {
                return (
                  <Element name={e.key} level={e.level} key={e.key} id={e.id} />
                );
              } else if (e.back) {
                return <Back onClick={() => setFreestyle(e.key)} key="back" />;
              } else {
                return (
                  <Folder
                    key={e.key}
                    name={e.key}
                    onClick={(el) => setFreestyle(el)}
                  />
                );
              }
            })}
          </div>
        )
      )}
    </Wrapper>
  );

  function ViewSelect({
    state,
  }: {
    state: Dispatch<"list" | "grid" | "board">;
  }) {
    function StyledTab({
      icon,
      hideSmall,
    }: {
      icon: object;
      hideSmall?: boolean;
    }) {
      return (
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={`${
                selected
                  ? "bg-white dark:bg-gray-100 shadow text-yellow-500"
                  : "hover:bg-black/10 hover:text-gray-700 dark:hover:text-gray-400 text-gray-500 dark:text-gray-400"
              } p-2.5 text-sm leading-5 font-medium rounded-lg focus:outline-none fouces:ring-2 ring-offset-2 ring-offset-yellow-500 ring-white ring-opacity-60${
                hideSmall && "hidden xs:block"
              }`}
            >
              {icon}
            </button>
          )}
        </Tab>
      );
    }
    return (
      <Tab.Group
        defaultIndex={2}
        onChange={(index) => {
          /* if (index === 0) {
            state("board");
          } else if (index === 1) {
            state("list");
          } else if (index === 2) {
            state("grid");
          } */
          if (index === 0 || index > 0) {
            state("grid");
          }
        }}
      >
        <Tab.List className="flex p-1 space-x-1 rounded-xl bg-gray-200 dark:bg-gray-700 h-fit ">
          {
            //"<StyledTab icon={<HiViewBoards />} hideSmall />"
          }
          {
            //"<StyledTab icon={<HiViewList />} />"
          }
          <StyledTab icon={<HiViewGrid />} />
        </Tab.List>
      </Tab.Group>
    );
  }

  function Back({ onClick }: { onClick: () => void }) {
    return (
      <div
        className="p-4 rounded-xl shadow break-words items-center flex font-bold sm:text-lg md:text-xl cursor-pointer bg-gray-500/50"
        onClick={() => {
          onClick();
        }}
      >
        <HiArrowLeft className="mr-2 text-xl" />
        {t("common:action.back")}
      </div>
    );
  }

  function Folder({ name, onClick }: { name: string; onClick: any }) {
    return (
      <div
        className={
          "p-4 rounded-xl shadow break-words items-center flex font-bold sm:text-lg md:text-xl cursor-pointer border-2 border-gray-500"
        }
        onClick={() => {
          onClick(name);
        }}
      >
        <span className="truncate">
          {t(`freestyle:${name.split("_")[name.split("_").length - 1]}`)}
        </span>
      </div>
    );
  }

  function Group({
    children,
    name,
    uncollapsed,
    cardStyle,
    onClick,
  }: {
    children?: any;
    name: string;
    uncollapsed?: boolean;
    cardStyle?: boolean;
    onClick: () => void;
  }) {
    const [isCollapsed, setIsCollapsed] = useState(!uncollapsed);

    return (
      <div
        className={`border-l border-gray-300 flex flex-col ${
          cardStyle && "rounded-xl p-4 shadow border-none"
        }`}
      >
        {cardStyle ? (
          <span className="text-xl font-bold border-b w-full mb-2">{name}</span>
        ) : (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              setIsCollapsed(!isCollapsed);
              onClick();
            }}
          >
            <span className="text-xl w-6">
              {isCollapsed ? <FaCaretRight /> : <FaCaretDown />}
            </span>
            <span className="font-bold">{name}</span>
          </div>
        )}
        <div className={`${!cardStyle && "pl-6"} flex flex-col space-y-2`}>
          {!isCollapsed && children}
        </div>
      </div>
    );
  }

  function Element({
    id,
    name,
    level,
  }: {
    id?: string;
    name: string;
    level?: string;
  }) {
    const element = freestyleDataOwn.find((e) => e.element === id);
    return (
      <div
        className="flex justify-between items-center border rounded-lg p-2 cursor-pointer hover:bg-gray-500/50 relative "
        onClick={() => {
          saveFreestyleDataOwn(id as string, !element?.stateUser).then(() => {
            getUserData();
          });
        }}
      >
        <span className="break-word overflow-hidden overflow-ellipsis text-sm xs:text-base">
          {t(`freestyle:${name}`)}
        </span>
        <div className="flex flex-col xs:flex-row">
          {level && (
            <span className="text-[0.6rem] xs:text-xs opacity-80 whitespace-nowrap absolute top-0 right-2">
              Lvl. {level}
            </span>
          )}
          <span className="xs:text-2xl self-end xs:self-center ml-2 py-2">
            {element?.stateCoach ? (
              <FaSquare />
            ) : element?.stateUser ? (
              <FaRegCheckSquare />
            ) : (
              <FaRegSquare />
            )}
          </span>
        </div>
      </div>
    );
  }
}
