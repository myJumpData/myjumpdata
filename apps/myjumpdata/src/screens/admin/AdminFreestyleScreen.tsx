import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFolder, FaFolderPlus, FaPlus } from "react-icons/fa";
import { HiArrowLeft, HiArrowRight, HiCheck } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import AuthVerify from "../../common/AuthVerify";
import AdminActionBar from "../../components/AdminActionBar";
import Breadcrumb from "../../components/Breadcrumb";
import { setRoute } from "../../redux/route.action";
import { getFreestyle } from "../../service/freestyle.service";
import Table from "../../components/Table";

type freestyle_folder_data = {
  id: string;
  key: string;
  back?: boolean;
  level?: string;
  group?: boolean;
  element?: boolean;
  compiled?: boolean;
};

export default function AdminFreestyleScreen() {
  useEffect(() => {
    setRoute("admin/freestyle");
    AuthVerify({
      isAdmin: true,
    });
  }, []);
  const navigate = useNavigate();
  const [data, setData] = useState<any[] | undefined>();
  const [freestyle, setFreestyle] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    getFreestyle(freestyle).then((response: any) => {
      setData(
        response.data.map((item: freestyle_folder_data) => {
          const newItem: any = {};
          const onClick = () => {
            if (item.back) {
              setFreestyle(item.key);
            }
            if (item.group) {
              setFreestyle(item.key);
            }
            if (item.element) {
              return navigate("/admin/freestyle/element/" + item.id);
            }
            return;
          };
          newItem.name = (
            <div className="flex cursor-pointer items-center" onClick={onClick}>
              <span className="w-8">
                {(() => {
                  if (item.back) {
                    return <HiArrowLeft />;
                  }
                  if (item.group) {
                    return <FaFolder />;
                  }
                  if (item.element) {
                    return <HiArrowRight />;
                  }
                  return;
                })()}
              </span>
              <span>
                {
                  (() => {
                    if (item.back) {
                      return t("common:back");
                    }
                    if (item.group) {
                      return t(`freestyle:${item.key.split("_").at(-1)}`);
                    }
                    if (item.element) {
                      if (item.compiled) {
                        return item.key
                          .split("_")
                          .map((item) => t(`freestyle:${item}`))
                          .join(" ");
                      }
                      return t(`freestyle:${item.key}`);
                    }
                    return "";
                  })() as string
                }
              </span>
            </div>
          );
          newItem.key = (
            <span
              className="flex cursor-pointer items-center"
              onClick={onClick}
            >
              {
                (() => {
                  if (item.back) {
                    return "";
                  }
                  if (item.group) {
                    return item.key.split("_").at(-1);
                  }
                  if (item.element) {
                    if (item.compiled) {
                      return item.key.split("_").join(" ");
                    }
                    return item.key;
                  }
                  return "";
                })() as string
              }
            </span>
          );
          newItem.level = (
            <span
              className="flex cursor-pointer items-center justify-end text-right"
              onClick={onClick}
            >
              {
                (() => {
                  if (item.back) {
                    return "";
                  }
                  if (item.group) {
                    return "";
                  }
                  if (item.element) {
                    if (item.level) {
                      return `Lvl. ${item.level}`;
                    }
                    return "";
                  }
                  return "";
                })() as string
              }
            </span>
          );
          newItem.compiled = (
            <span
              className="items-center, flex cursor-pointer justify-center"
              onClick={onClick}
            >
              {
                (() => {
                  if (item.compiled) {
                    return <HiCheck className="text-2xl text-green-500" />;
                  }
                  return "";
                })() as string
              }
            </span>
          );
          return newItem;
        })
      );
    });
  }, [freestyle, navigate, t]);

  return (
    <>
      <AdminActionBar
        text={t("common:nav_freestyle")}
        actions={[
          {
            icon: FaPlus,
            onClick: () => {
              navigate(`/admin/freestyle/create/${freestyle}`);
              return;
            },
          },
          {
            icon: FaFolderPlus,
            onClick: () => {
              return;
            },
          },
        ]}
      />
      <Breadcrumb
        data={freestyle ? freestyle.split("_") : []}
        setState={setFreestyle}
      />
      <Table
        structure={[
          { name: "Name", key: "name", options: { align: "text-left" } },
          { name: "Key", key: "key", options: { align: "text-left" } },
          { name: "Compiled", key: "compiled" },
          { name: "Level", key: "level", options: { align: "text-right" } },
        ]}
        data={data}
      />
    </>
  );
}
