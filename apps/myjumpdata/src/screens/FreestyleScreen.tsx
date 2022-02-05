import { setFreestyle } from "@myjumpdata/redux";
import { getFreestyle, getFreestyleDataOwn } from "@myjumpdata/service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiChevronRight, HiHome, HiOutlineHome } from "react-icons/hi";
import { useSelector } from "react-redux";
import AuthVerify from "../common/AuthVerify";
import { Back, Element, Folder } from "../parts/Freestyle";
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
                element={freestyleDataOwn?.find((e) => e.element === e.id)}
                onRefresh={() => {
                  getUserData();
                }}
              />
            );
          } else if (e.back) {
            return <Back to={e.key} key="back" state={setFreestyle} />;
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
}
