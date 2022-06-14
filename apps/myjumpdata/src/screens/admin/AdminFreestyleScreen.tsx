import i18next from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFolder, FaFolderMinus, FaFolderPlus, FaPlus } from "react-icons/fa";
import { HiArrowLeft, HiArrowRight, HiCheck } from "react-icons/hi";
import { useParams } from "react-router";
import { generatePath, Outlet, useNavigate } from "react-router-dom";
import AuthVerify from "../../common/AuthVerify";
import AdminActionBar from "../../components/AdminActionBar";
import Breadcrumb from "../../components/Breadcrumb";
import Button from "../../components/Button";
import { TextInput } from "../../components/Input";
import Table from "../../components/Table";
import { setRoute } from "../../redux/route.action";
import {
  createFreestyleGroup,
  deleteFreestyleGroup,
} from "../../service/admin.service";
import { getFreestyle } from "../../service/freestyle.service";

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
    i18next.loadNamespaces("freestyle").then(() => {
      setLoaded(true);
    });
  }, []);
  const navigate = useNavigate();
  const params = useParams();
  const path = params.path || "";

  const [data, setData] = useState<any[] | undefined>();
  const { t, i18n } = useTranslation();
  const [newFolder, setNewFolder] = useState<any>();
  const [newFolderValid, setNewFolderValid] = useState<undefined | boolean>();
  const [del, setDel] = useState(false);
  const [parent, setParent] = useState("");
  const [loaded, setLoaded] = useState(false);

  const getData = () => {
    getFreestyle(path).then((response: any) => {
      setData(
        response.data.map((item: freestyle_folder_data) => {
          if (item.back) {
            setParent(item.key);
          }
          const newItem: any = {};
          const onClick = () => {
            if (item.back) {
              return navigate(
                generatePath("/admin/freestyle/list/:path", { path: item.key })
              );
            }
            if (item.group) {
              return navigate(
                generatePath("/admin/freestyle/list/:path", { path: item.key })
              );
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
                {loaded
                  ? ((() => {
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
                    })() as string)
                  : null}
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
    if (loaded) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, loaded]);

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

  if (!loaded) {
    return <Outlet />;
  }

  return (
    <>
      <AdminActionBar
        text={t("common:nav_freestyle")}
        actions={[
          path === ""
            ? null
            : {
                icon: FaPlus,
                onClick: () => {
                  navigate(`/admin/freestyle/create/${path}`);
                  return;
                },
              },
          {
            icon: FaFolderPlus,
            onClick: () => {
              setNewFolder("");
            },
          },
          path !== "" && data && data.length <= 1
            ? {
                icon: FaFolderMinus,
                onClick: () => {
                  setDel(true);
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
              ...(path ? path.split("_") : []),
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
                `${path === "" ? "" : `${path}_`}${newFolder}`,
                path
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
        data={path ? path.split("_") : []}
        setState={(e) => {
          navigate(generatePath("/admin/freestyle/list/:path", { path: e }));
        }}
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
            Are you sure you want to delete this Freestyle Group?
          </span>
          <Button
            name="Delete"
            design="danger"
            onClick={() => {
              if (data) {
                deleteFreestyleGroup(path).then(() => {
                  setDel(false);
                  navigate(
                    generatePath("/admin/freestyle/list/:path", {
                      path: parent,
                    })
                  );
                });
              }
            }}
          />
        </div>
      </div>
    );
  }
}
