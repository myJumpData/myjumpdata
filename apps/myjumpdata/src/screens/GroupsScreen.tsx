import { setRoute } from "@myjumpdata/redux";
import { createGroup, getGroups } from "@myjumpdata/service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { TextInput } from "../components/Input";

export default function GroupsScreen() {
  useEffect(() => {
    setRoute("group");
  }, []);

  const user = useSelector((state: any) => state.user);
  const { t } = useTranslation();

  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    getGroupsFN();
  }, []);

  function getGroupsFN() {
    getGroups().then((response: any) => {
      setGroups(response.data);
    });
  }

  function handleCreateGroup() {
    createGroup(groupName.trim()).then(() => {
      getGroupsFN();
      setGroupName("");
    });
  }

  return (
    <>
      <div className="w-full space-y-2">
        <span className="font-bold text-xl">{t("common:nav_group")}</span>
      </div>
      <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4 space-y-4 sm:space-y-0">
        {groups?.map((group: any) => (
          <Link
            to={`/group/${group._id}`}
            key={group._id}
            className="w-full bg-gray-300 px-4 py-2 md:px-8 md:py-4 rounded-lg shadow overflow-ellipsis overflow-hidden items-center flex md:justify-center hover:bg-gray-200 dark:hover:bg-gray-800 outline-gray-700 dark:outline-gray-200 dark:outline dark:bg-transparent"
          >
            <span className="font-bold text-lg md:text-xl">{group.name}</span>
          </Link>
        ))}
      </div>
      {user.roles.includes("coach") && (
        <>
          <div className="w-full space-y-2">
            <span className="font-bold text-xl">
              {t("common:create_group")}
            </span>
          </div>
          <div className="max-w-screen-sm">
            <TextInput
              name={t("common:group_name") + ":"}
              type="text"
              value={groupName}
              stateChange={setGroupName}
            />
            <Button
              name={t("common:create_group")}
              onClick={handleCreateGroup}
              design="success"
            />
          </div>
        </>
      )}
    </>
  );
}
