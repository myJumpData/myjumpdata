import i18next from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Outlet, useNavigate } from "react-router-dom";
import AuthVerify from "../common/AuthVerify";
import Breadcrumb from "../components/Breadcrumb";
import { Element, Folder } from "../components/Freestyle";
import Spinner from "../components/Spinner";
import { setRoute } from "../redux/route.action";
import { getFreestyle, getUserFreestyle } from "../service/freestyle.service";
import { freestyle_folder_data } from "../types/freestyle_folder_data";

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
  const user = useSelector((state: any) => state.user);

  const {
    isFetching: freestyle_isFetching,
    isSuccess: freestyle_isSuccess,
    data: freestyle_data,
    refetch: freestyle_refetch,
  } = useQuery(["freestyle", freestyle], async () => {
    return await getFreestyle(freestyle);
  });
  const {
    isFetching: freestyle_user_isFetching,
    isSuccess: freestyle_user_isSuccess,
    data: freestyle_user_data,
    refetch: freestyle_user_refetch,
  } = useQuery(
    ["freestyle_user", freestyle, freestyle_data, user],
    async () => {
      return await getUserFreestyle(
        [user.id],
        freestyle_data?.data.map((e: any) => e.id)
      );
    }
  );

  const [loaded, setLoaded] = useState(false);

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
        setState={(e: string) => {
          navigate("/freestyle/own/" + e);
        }}
        isRefreshing={freestyle_isFetching || freestyle_user_isFetching}
        refresh={() => {
          freestyle_refetch();
          freestyle_user_refetch();
        }}
      />

      {freestyle_isSuccess ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {freestyle_data?.data.map((e: freestyle_folder_data) => {
            if (e.set) {
              return null;
            }
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
                    freestyle_user_isSuccess
                      ? freestyle_user_data?.data.find(
                          (i) => i.element === e.id
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
                    navigate("/freestyle/own/" + e);
                  }}
                />
              );
            }
          })}
        </div>
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
