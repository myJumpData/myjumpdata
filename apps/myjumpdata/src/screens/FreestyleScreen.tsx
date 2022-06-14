import i18next from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Outlet, useNavigate } from "react-router-dom";
import AuthVerify from "../common/AuthVerify";
import Breadcrumb from "../components/Breadcrumb";
import { Back, Element, Folder } from "../components/Freestyle";
import { setRoute } from "../redux/route.action";
import {
  getFreestyle,
  getFreestyleDataOwn,
} from "../service/freestyle.service";
import { getClub } from "../service/groups.service";

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
export default function FreestyleScreen() {
  useEffect(() => {
    setRoute("freestyle");
    AuthVerify();
    i18next.loadNamespaces("freestyle").then(() => {
      setLoaded(true);
    });
  }, []);

  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const freestyle = params.freestyle || "";

  const [freestyleDataOwn, setFreestyleDataOwn] = useState<any[]>([]);
  const [folderData, setFolderData] = useState<freestyle_folder_data[]>([]);
  const [club, setClub] = useState<any>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await getUserData();
    })();
  }, []);

  useEffect(() => {
    if (loaded) {
      getCurrentData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freestyle, loaded]);

  function getUserData() {
    getClub().then((response) => {
      setClub(response.data);
    });
    return getFreestyleDataOwn().then((response: any) => {
      setFreestyleDataOwn(response.data);
      return Promise.resolve();
    });
  }

  function getCurrentData() {
    getFreestyle(freestyle).then((response: any) => {
      setFolderData(response.data);
    });
  }

  if (!loaded) {
    return <Outlet />;
  }

  return (
    <>
      <div className="w-full space-y-2">
        <span className="text-xl font-bold">
          {t<string>("common:nav_freestyle")}
        </span>
      </div>
      <Breadcrumb
        data={freestyle ? freestyle.split("_") : []}
        setState={(e) => {
          navigate("/freestyle/own/" + e);
        }}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                element={
                  freestyleDataOwn?.find((i) => i.element === e.id) || {}
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
                  navigate("/freestyle/own/" + e);
                }}
              />
            );
          } else {
            if (!club && e.set) {
              return null;
            }
            if (club && e.set && e.club !== club._id) {
              return null;
            }
            return (
              <Folder
                key={e.key}
                set={e.set}
                name={e.key}
                onClick={(e) => {
                  navigate("/freestyle/own/" + e);
                }}
              />
            );
          }
        })}
      </div>
    </>
  );
}
