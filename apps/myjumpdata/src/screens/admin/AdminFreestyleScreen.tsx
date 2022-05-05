import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFolder, FaFolderMinus, FaFolderPlus, FaPlus } from "react-icons/fa";
import { HiArrowLeft, HiArrowRight, HiCheck } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import AuthVerify from "../../common/AuthVerify";
import AdminActionBar from "../../components/AdminActionBar";
import Breadcrumb from "../../components/Breadcrumb";
import { setRoute } from "../../redux/route.action";
import { getFreestyle } from "../../service/freestyle.service";
import Table from "../../components/Table";
import { useSelector } from "react-redux";
import { setFreestyleAdmin } from "../../redux/freestyleAdmin.action";
import { TextInput } from "../../components/Input";
import Button from "../../components/Button";
import { createFreestyleGroup } from "../../service/admin.service";

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

  const freestyleAdmin = useSelector((state: any) => state.freestyleAdmin);
  const [data, setData] = useState<any[] | undefined>();
  const { t, i18n } = useTranslation();
  const [newFolder, setNewFolder] = useState<any>();
  const [newFolderValid, setNewFolderValid] = useState<undefined | boolean>();

  const getData = () => {
    getFreestyle(freestyleAdmin || "").then((response: any) => {
      setData(
        response.data.map((item: freestyle_folder_data) => {
          const newItem: any = {};
          const onClick = () => {
            if (item.back) {
              setFreestyleAdmin(item.key);
            }
            if (item.group) {
              setFreestyleAdmin(item.key);
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
          newItem.level = (() => {
            if (item.element && item.level) {
              return (
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
            }
            return;
          })();
          newItem.compiled = (() => {
            if (item.compiled) {
              return (
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
            }
            return;
          })();
          return newItem;
        })
      );
    });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freestyleAdmin]);

  useEffect(() => {
    setNewFolderValid(undefined);
    if (newFolder) {
      if (i18n.exists(`freestyle:${newFolder}`)) {
        setNewFolderValid(true);
      } else {
        setNewFolderValid(false);
      }
    }
  }, [i18n, newFolder]);

  return (
    <>
      <AdminActionBar
        text={t("common:nav_freestyle")}
        actions={[
          freestyleAdmin !== ""
            ? {
                icon: FaPlus,
                onClick: () => {
                  navigate(`/admin/freestyle/create/${freestyleAdmin}`);
                  return;
                },
              }
            : null,
          {
            icon: FaFolderPlus,
            onClick: () => {
              setNewFolder("");
            },
          },
          freestyleAdmin !== ""
            ? {
                icon: FaFolderMinus,
                onClick: () => {
                  return;
                },
              }
            : null,
        ]}
      />
      {newFolder !== undefined && (
        <div className="rounded-2xl border-2 border-gray-500/50 p-4">
          <TextInput
            type="text"
            stateChange={setNewFolder}
            value={newFolder}
            name="Folder Key"
            valid={newFolderValid}
          />
          <Breadcrumb
            data={[
              ...(freestyleAdmin ? freestyleAdmin.split("_") : []),
              ...(newFolderValid ? newFolder.split("_") : []),
            ]}
            setState={() => {
              return;
            }}
          />
          <Button
            name="Save"
            design={newFolderValid ? "success" : "secondary"}
            onClick={() => {
              if (!newFolderValid) {
                return;
              }
              createFreestyleGroup(
                `${
                  freestyleAdmin !== "" ? `${freestyleAdmin}_` : ""
                }${newFolder}`,
                freestyleAdmin
              ).then(() => {
                getData();
                setNewFolderValid(undefined);
                setNewFolder(undefined);
              });
            }}
          />
        </div>
      )}
      <Breadcrumb
        data={freestyleAdmin ? freestyleAdmin.split("_") : []}
        setState={setFreestyleAdmin}
      />
      <Table
        structure={[
          { name: "Name", key: "name", options: { align: "text-left" } },
          { name: "Key", key: "key", options: { align: "text-left" } },

          data && data.filter((item) => !!item?.compiled).length > 0
            ? { name: "Compiled", key: "compiled" }
            : null,
          data && data.filter((item) => !!item?.level).length > 0
            ? {
                name: "Level",
                key: "level",
                options: { align: "text-right" },
              }
            : null,
        ]}
        data={data}
      />
    </>
  );
}
