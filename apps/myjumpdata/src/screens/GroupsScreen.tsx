import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AuthVerify from "../common/AuthVerify";
import Button from "../components/Button";
import { TextInput } from "../components/Input";
import { setRoute } from "../redux/route.action";
import { createGroup, getClub, getGroups } from "../service/groups.service";
import { HiCog } from "react-icons/hi";

export default function GroupsScreen() {
  useEffect(() => {
    setRoute("group");
    AuthVerify();
  }, []);

  const user = useSelector((state: any) => state.user);
  const { t } = useTranslation();

  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [club, setClub] = useState<any>();

  useEffect(() => {
    getGroupsFN();
  }, []);

  function getGroupsFN() {
    getClub().then((response) => {
      setClub(response.data);
    });
    getGroups().then((response: any) => {
      setGroups(response.data);
    });
  }

  function handleCreateGroup() {
    createGroup(groupName.trim(), club?._id).then(() => {
      getGroupsFN();
      setGroupName("");
    });
  }

  return (
    <>
      {club ? (
        <>
          <div className="flex">
            <div className="w-full">
              <span className="text-xl font-bold">
                {t<string>("common:nav_club")}
              </span>
            </div>
            {club.admins?.some((i: any) => i._id === user.id) && (
              <Link
                to={`/club/admin`}
                className="flex aspect-square h-8 w-8 items-center justify-center rounded-full text-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-gray-800 dark:focus:ring-offset-white"
              >
                <HiCog />
              </Link>
            )}
          </div>
          <span className="flex items-center space-x-2">
            <span className="h-16 w-16">
              <img
                src={club.logo}
                alt={`Logo-${club.name}`}
                className="h-full w-full object-contain"
              />
            </span>
            <div className="flex flex-col">
              <span className="text-xl font-bold opacity-90">{club.name}</span>
              <span className="opacity-75">
                {(() => {
                  let tmp: string[] = [];
                  if (club.coaches?.some((e: any) => e._id === user.id)) {
                    tmp = [...tmp, "Coach"];
                  }
                  if (club.athletes?.some((e: any) => e._id === user.id)) {
                    tmp = [...tmp, "Athlete"];
                  }
                  if (club.admins?.some((e: any) => e._id === user.id)) {
                    tmp = [...tmp, "Admin"];
                  }
                  return tmp;
                })().join(" | ")}
              </span>
            </div>
          </span>
        </>
      ) : null}
      <div className="w-full space-y-2">
        <span className="text-xl font-bold">
          {t<string>("common:nav_group")}
        </span>
      </div>
      {club !== null ? (
        <>
          <div className="flex flex-col space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 md:grid-cols-3 lg:grid-cols-4">
            {groups?.map((group: any) => (
              <Link
                to={`/group/${group._id}`}
                key={group._id}
                className="flex w-full items-center overflow-hidden overflow-ellipsis rounded-lg bg-gray-300 px-4 py-2 shadow outline-gray-700 hover:bg-gray-200 dark:bg-transparent dark:outline dark:outline-gray-200 dark:hover:bg-gray-800 md:justify-center md:px-8 md:py-4"
              >
                <span className="text-lg font-bold md:text-xl">
                  {group.name}
                </span>
              </Link>
            ))}
          </div>
          {club &&
          [...club.coaches, ...club.admins].some(
            (i: any) => i._id === user.id
          ) ? (
            <>
              <div className="w-full space-y-2">
                <span className="text-xl font-bold">
                  {t<string>("common:create_group")}
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
          ) : null}
        </>
      ) : (
        <div className="flex flex-col">
          <span className="mb-4 text-lg opacity-75">{t("club_notfound")}</span>
          <span className="mb-4 text-lg opacity-75">
            {t("club_notfound_apply")}
          </span>
          <a href="mailto:myjumpdata@gmail.com">myjumpdata@gmail.com</a>
        </div>
      )}
    </>
  );
}
