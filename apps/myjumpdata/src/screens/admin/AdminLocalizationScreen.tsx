import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { IoPencil, IoTrash } from "react-icons/all";

export default function AdminLocalizationScreen() {
  useEffect(() => {
    setRoute("admin/localization");
    AuthVerify({
      isAdmin: true,
    });
  }, []);
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limti: 10,
    namespace: NAMESPACES[0],
  } as any);
  const navigate = useNavigate();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const namespace = searchParams.get("namespace") || NAMESPACES[0];

  const [translationData, setTranslationData] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getTranslations(namespace).then((response) => {
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
              {LANGUAGES.map((element, index) => {
                const k = item[0] + "_" + element;
                if (item[1][element] !== undefined) {
                  return (
                    <Fragment key={index}>
                      <span
                        className="flex h-full w-8 items-center overflow-hidden rounded border border-gray-500/50"
                        data-for={k}
                        data-tip={item[1][element]}
                      >
                        <Flag code={element === "en" ? "gb" : element} />
                      </span>
                      <ReactTooltip id={k} effect="solid" />
                    </Fragment>
                  );
                }
                return null;
              })}
            </div>
          );
          tmp.action = (
            <div className="flex items-center justify-end space-x-2">
              <Link
                to={
                  "/admin/localization/update/" +
                  searchParams.get("namespace") +
                  "/" +
                  tmp.key
                }
              >
                <IoPencil className="text-gray-500/50 transition hover:text-white" />
              </Link>
              <span
                onClick={() => {
                  setDel(true);
                  setCurrent(item[0]);
                }}
              >
                <IoTrash className="text-gray-500/50 transition hover:text-white" />
              </span>
            </div>
          );
          return tmp;
        });
      setTranslationData(data);
      setTotal(Object.entries(response.data.data).length);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace]);
  useEffect(() => {
    setData(
      translationData.slice((page - 1) * limit, (page - 1) * limit + limit)
    );
  }, [limit, page, translationData]);

  const [del, setDel] = useState(false);
  const [current, setCurrent] = useState<any>();

  return (
    <>
      <AdminActionBar
        text={`${t<string>("common:nav_localization")} - ${namespace}`}
        actions={[
          {
            icon: FaPlus,
            onClick: () => {
              navigate(`/admin/localization/create/${namespace}`);
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
          setSearchParams({ limit, page, namespace: e } as any);
        }}
        current={namespace}
      />

      <Table
        limit={limit}
        page={page}
        setLimit={(e) => {
          setSearchParams({ limit: e, page, namespace } as any);
        }}
        setPage={(e) => {
          setSearchParams({ page: e, limit, namespace } as any);
        }}
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
            {namespace}:{current}
          </span>
          <Button
            name="Delete"
            design="danger"
            onClick={() => {
              deleteLocalization(namespace, current).then(() => {
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
