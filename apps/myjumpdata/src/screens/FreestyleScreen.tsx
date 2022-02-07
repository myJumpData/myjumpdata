import { setFreestyle } from "@myjumpdata/redux";
import { getFreestyle, getFreestyleDataOwn } from "@myjumpdata/service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AuthVerify from "../common/AuthVerify";
import Breadcrumb from "../components/Breadcrumb";
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
  const { t } = useTranslation();

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
      <Breadcrumb
        data={freestyle ? freestyle.split("_") : []}
        setState={setFreestyle}
      />

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
                user="own"
                element={freestyleDataOwn?.find((i) => i.element === e.id)}
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
