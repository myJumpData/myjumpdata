import AdminActionBar from "../../components/AdminActionBar";
import { TextInput } from "../../components/Input";
import Breadcrumb from "../../components/Breadcrumb";
import { LANGUAGES } from "../../Constants";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Flag from "react-world-flags";
import { useParams } from "react-router";
import { HiCheck } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import {
  createFreestyle,
  getFreestyleTranslation,
} from "../../service/admin.service";
import { FaPlus } from "react-icons/fa";
import { classNames } from "../../utils/classNames";
import { HiTrash } from "react-icons/all";
import Button from "../../components/Button";
import { getFreestyle } from "../../service/freestyle.service";

export default function AdminFreestyleCreateScreen() {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();

  const [key, setKey] = useState("");
  const [level, setLevel] = useState("");
  const [translation, setTranslation] = useState<any>({});
  const [groups, setGroups] = useState<any>([{ key: params.path }]);
  const [newGroup, setNewGroup] = useState<any>();
  const [newGroupValid, setNewGroupValid] = useState<undefined | boolean>();

  useEffect(() => {
    getFreestyleTranslation(key).then((res) => {
      setTranslation(res.data);
    });
  }, [key]);

  useEffect(() => {
    setNewGroupValid(undefined);
    if (newGroup) {
      getFreestyle(newGroup).then((res) => {
        if (res.status === 200) {
          setNewGroupValid(res.data.length > 0);
        } else {
          setNewGroupValid(false);
        }
      });
    }
  }, [newGroup]);

  return (
    <>
      <AdminActionBar
        text={`${t<string>("common:nav_freestyle")} - Create`}
        actions={[
          {
            icon: HiCheck,
            onClick: () => {
              createFreestyle(
                key,
                level,
                groups.map((e) => e.key)
              ).then((res: any) => {
                if (res.key === "success.create.freestyle") {
                  navigate(-1);
                }
              });
            },
          },
        ]}
      />
      <div>
        <TextInput
          type="text"
          inputName="key"
          name="Key"
          value={key}
          stateChange={setKey}
        />
        <TextInput
          type="text"
          inputName="level"
          name="Level"
          value={level}
          stateChange={setLevel}
        />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <span className="font-bold">Groups</span>
          <span
            className="opacity-75 transition hover:scale-125 hover:opacity-100"
            onClick={() => {
              setNewGroup("");
            }}
          >
            <FaPlus />
          </span>
        </div>
        {groups.map((group) => (
          <div className="my-2 flex items-center" key={group.key}>
            <div className={classNames("grow", groups.length > 1 && "pr-4")}>
              <Breadcrumb
                data={group.key.split("_")}
                setState={() => {
                  return;
                }}
              />
            </div>
            {groups.length > 1 && (
              <span
                className="cursor-pointer opacity-75 transition hover:scale-125 hover:opacity-100"
                onClick={() => {
                  setGroups(
                    groups.filter((element) => {
                      return element.key !== group.key;
                    })
                  );
                  setNewGroup(undefined);
                  setNewGroupValid(undefined);
                }}
              >
                <HiTrash />
              </span>
            )}
          </div>
        ))}
        {newGroup !== undefined && (
          <div className="rounded-2xl border-2 border-gray-500/50 p-4">
            <TextInput
              type="text"
              stateChange={setNewGroup}
              value={newGroup}
              name="Group Key"
              valid={newGroupValid}
            />
            <Breadcrumb
              data={newGroupValid ? newGroup.split("_") : []}
              setState={() => {
                return;
              }}
            />
            <Button
              name="Save"
              design={newGroupValid ? "success" : "secondary"}
              onClick={() => {
                if (!newGroupValid) {
                  return;
                }
                setGroups([...groups, { key: newGroup }]);
                setNewGroup(undefined);
                setNewGroupValid(undefined);
              }}
            />
          </div>
        )}
      </div>
      <div>
        <span className="font-bold">Translations</span>
        {translation &&
          LANGUAGES.map((lang) => (
            <div
              className="my-2 flex h-8 items-center space-x-2 overflow-hidden rounded-lg bg-gray-500/50 px-4 py-2"
              key={lang}
            >
              <span className="flex h-full w-12 items-center">
                <Flag code={lang === "en" ? "gb" : lang} />
              </span>

              <span className="px-4 py-2">
                {key
                  .split("_")
                  .map((item) => {
                    if (translation[lang]) {
                      return translation[lang][item];
                    }
                    return null;
                  })
                  .join(" ")}
              </span>
            </div>
          ))}
      </div>
    </>
  );
}
