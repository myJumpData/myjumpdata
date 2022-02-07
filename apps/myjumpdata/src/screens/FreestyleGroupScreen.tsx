import { setFreestyle } from "@myjumpdata/redux";
import { getFreestyle, getFreestyleData, getGroup } from "@myjumpdata/service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AuthVerify from "../common/AuthVerify";
import Breadcrumb from "../components/Breadcrumb";
import { SelectInput } from "../components/Input";
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

export default function FreestyleGroupScreen() {
  AuthVerify();
  const params = useParams();

  const [groupName, setGroupName] = useState("");
  const [userSelect, setUserSelect] = useState([]);
  const [userSelected, setUserSelected] = useState("");

  const freestyle = useSelector((state: any) => state.freestyle);

  const [freestyleDataUser, setFreestyleDataUser] = useState<any[]>([]);
  const [folderData, setFolderData] = useState<freestyle_folder_data[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    getGroup(params.id as string).then((response: any) => {
      setGroupName(response.data?.name);
      const tmp = response.data?.athletes.map((e) => {
        return {
          name:
            e.firstname && e.lastname
              ? `${e.firstname} ${e.lastname}`
              : e.username,
          value: e.id,
        };
      });
      setUserSelect(tmp);
      setUserSelected(tmp[0].value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelected]);

  useEffect(() => {
    getCurrentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freestyle]);

  function getUserData() {
    if (userSelected) {
      getFreestyleData(userSelected).then((response: any) => {
        setFreestyleDataUser(response.data);
      });
    }
  }

  function getCurrentData() {
    getFreestyle(freestyle).then((response: any) => {
      setFolderData(response.data);
    });
  }

  return (
    <Wrapper current="group">
      <div className="w-full space-y-2">
        <span className="font-bold text-xl">
          {t("freestyle.title") + " " + groupName}
        </span>
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-full">
          <SelectInput
            options={userSelect}
            current={userSelected}
            stateChange={setUserSelected}
          />
        </div>
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
                user={userSelected}
                name={e.key}
                level={e.level}
                key={e.key}
                id={e.id}
                compiled={e.compiled}
                element={freestyleDataUser?.find((i) => i.element === e.id)}
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
