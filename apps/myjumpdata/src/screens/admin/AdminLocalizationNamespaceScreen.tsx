import { LANGUAGES } from "@myjumpdata/const";
import { setRoute } from "@myjumpdata/redux";
import { getTranslations } from "@myjumpdata/service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import Flag from "react-world-flags";
import AuthVerify from "../../common/AuthVerify";
import Table from "../../components/Table";

export default function AdminLocalizationNamespaceScreen() {
  useEffect(() => {
    setRoute("admin/localization");
    AuthVerify({
      isAdmin: true,
    });
  }, []);
  const params = useParams();
  const { t } = useTranslation();

  const [translationData, setTranslationData] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (params.namespace) {
      getTranslations(params.namespace).then((response) => {
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
            return tmp;
          });
        setTranslationData(data);
        setTotal(Object.entries(response.data.data).length);
      });
    }
  }, [params.namespace]);
  useEffect(() => {
    setData(
      translationData.slice((page - 1) * limit, (page - 1) * limit + limit)
    );
  }, [limit, page, translationData]);

  return (
    <>
      <div className="w-full space-y-2">
        <span className="text-xl font-bold">
          {t<string>("common:nav_localization")} - {params.namespace}
        </span>
      </div>

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
        ]}
        data={data}
        total={total}
      />
    </>
  );
}
