import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaTrash } from "react-icons/fa";
import { generatePath, Outlet, useNavigate } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import Flag from "react-world-flags";
import AuthVerify from "../../common/AuthVerify";
import AdminActionBar from "../../components/AdminActionBar";
import Button from "../../components/Button";
import { SelectInput } from "../../components/Input";
import Table from "../../components/Table";
import { LANGUAGES, NAMESPACES } from "../../Constants";
import { setRoute } from "../../redux/route.action";
import { deleteLocalization } from "../../service/admin.service";
import { getTranslations } from "../../service/locales.service";
import { useParams } from "react-router";

export default function AdminLocalizationScreen() {
  useEffect(() => {
    setRoute("admin/localization");
    AuthVerify({
      isAdmin: true,
    });
  }, []);
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();

  const path = params.path || "";

  const [translationData, setTranslationData] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!params.path || path === "") {
      navigate(
        generatePath("/admin/localization/list/:path", { path: NAMESPACES[0] })
      );
    }
  }, [navigate, params.path, path]);

  useEffect(() => {
    if (path !== "") {
      getTranslations(path).then((response) => {
        const data = Object.entries(response.data.data)
          .sort((a: any, b: any) => {
            const A = a[0].toUpperCase();
            const B = b[0].toUpperCase();
            if (A > B) {
              return 1;
            } else if (A < B) {
              return -1;
            } else {
              return 0;
            }
          })
          .map((item: any) => {
            const tmp: any = {};
            tmp.key = item[0];
            tmp.translation = (
              <div className="flex items-center space-x-1">
                {LANGUAGES.map((element) => {
                  const k = item[0] + "_" + element;
                  if (item[1][element] !== undefined) {
                    return (
                      <>
                        <span
                          className="flex h-full w-8 items-center overflow-hidden rounded border border-gray-500/50"
                          data-for={k}
                          data-tip={item[1][element]}
                        >
                          <Flag code={element === "en" ? "gb" : element} />
                        </span>
                        <ReactTooltip id={k} effect="solid" />
                      </>
                    );
                  }
                  return null;
                })}
              </div>
            );
            tmp.action = (
              <div className="flex justify-end">
                <span
                  onClick={() => {
                    setDel(true);
                    setCurrent(item[0]);
                  }}
                >
                  <FaTrash className="text-gray-500/50 transition hover:text-white" />
                </span>
              </div>
            );
            return tmp;
          });
        setTranslationData(data);
        setTotal(Object.entries(response.data.data).length);
      });
    }
  }, [path]);
  useEffect(() => {
    setData(
      translationData.slice((page - 1) * limit, (page - 1) * limit + limit)
    );
  }, [limit, page, translationData]);

  const [del, setDel] = useState(false);
  const [current, setCurrent] = useState<any>();

  if (path === "") {
    return <Outlet />;
  }

  return (
    <>
      <AdminActionBar
        text={`${t<string>("common:nav_localization")} - ${path}`}
        actions={[
          {
            icon: FaPlus,
            onClick: () => {
              navigate(`/admin/localization/create/${path}`);
            },
          },
        ]}
      />
      <SelectInput
        options={NAMESPACES.map((ns) => {
          return {
            value: ns,
            name: ns,
          };
        })}
        stateChange={(e) => {
          navigate(generatePath("/admin/localization/list/:path", { path: e }));
        }}
        current={path}
      />

      <Table
        limit={limit}
        page={page}
        setLimit={setLimit}
        setPage={setPage}
        pages={Math.ceil(total / limit)}
        structure={[
          { name: "Key", key: "key", options: { align: "text-left" } },
          {
            name: "Translation",
            key: "translation",
            options: { align: "text-left" },
          },
          { name: "", key: "action", options: { align: "text-right" } },
        ]}
        data={data}
        total={total}
      />
      <DelOverlay />
    </>
  );
  function DelOverlay() {
    return (
      <div
        className={
          "top-0 left-0 flex h-full w-full flex-col justify-center p-4 backdrop-blur backdrop-filter " +
          (del ? "fixed z-50" : "z-0 hidden")
        }
        onClick={() => {
          setDel(false);
        }}
      >
        <div className="mx-auto flex max-w-prose flex-col space-y-4 rounded-lg bg-gray-300/75 p-4 dark:bg-gray-600/75">
          <span className="text-xl font-bold">
            {t<string>("settings_delete_disclaimer_title")}
          </span>
          <span>
            {path}:{current}
          </span>
          <Button
            name="Delete"
            design="danger"
            onClick={() => {
              deleteLocalization(path, current).then(() => {
                setDel(false);
                setCurrent(null);
                setTranslationData(
                  translationData.filter((item: any) => item.key !== current)
                );
              });
            }}
          />
        </div>
      </div>
    );
  }
}
