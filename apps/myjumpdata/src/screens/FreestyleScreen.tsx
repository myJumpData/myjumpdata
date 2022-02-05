import { setFreestyle } from "@myjumpdata/redux";
import {
  getFreestyle,
  getFreestyleDataOwn,
  saveFreestyleDataOwn,
} from "@myjumpdata/service";
import { classNames } from "@myjumpdata/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegCheckSquare, FaRegSquare, FaSquare } from "react-icons/fa";
import {
  HiArrowLeft,
  HiChevronRight,
  HiHome,
  HiOutlineHome,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import AuthVerify from "../common/AuthVerify";
import Wrapper from "../parts/Wrapper";

type freestyle_folder_data = {
  id: string;
  key: string;
  back?: boolean;
  level?: string;
  group?: boolean;
  element?: boolean;
  compiled?: boolean;
};
export default function FreestyleScreen() {
  AuthVerify();

  const freestyle = useSelector((state: any) => state.freestyle);

  const [freestyleDataOwn, setFreestyleDataOwn] = useState<any[]>([]);
  const [folderData, setFolderData] = useState<freestyle_folder_data[]>([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    getCurrentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freestyle]);

  function getUserData() {
    getFreestyleDataOwn().then((response: any) => {
      setFreestyleDataOwn(response.data);
    });
  }

  function getCurrentData() {
    getFreestyle(freestyle).then((response: any) => {
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
                      {i18n.exists(`freestyle:${e}`) ? t(`freestyle:${e}`) : e}
                    </span>
                  </span>
                );
              })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {folderData?.map((e: freestyle_folder_data) => {
          if (e.element) {
            return (
              <Element
                name={e.key}
                level={e.level}
                key={e.key}
                id={e.id}
                compiled={e.compiled}
              />
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
    </Wrapper>
  );

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

  function Element({
    id,
    name,
    level,
    compiled,
  }: {
    id?: string;
    name: string;
    level?: string;
    compiled?: boolean;
  }) {
    const element = freestyleDataOwn?.find((e) => e.element === id);
    const { i18n } = useTranslation();
    return (
      <div
        className={classNames(
          "flex justify-between items-center border rounded-lg p-2 cursor-pointer hover:bg-gray-500/50 relative ",
          name
            .split("_")
            .map((item) => i18n.exists(`freestyle:${item}`))
            .some((item) => item === false) && "border border-red-500"
        )}
        onClick={() => {
          saveFreestyleDataOwn(id as string, !element?.stateUser).then(() => {
            getUserData();
          });
        }}
      >
        <span className="break-word overflow-hidden overflow-ellipsis text-sm xs:text-base">
          {compiled
            ? name
                .split("_")
                .map((item) => t(`freestyle:${item}`))
                .join(" ")
            : t(`freestyle:${name}`)}
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
