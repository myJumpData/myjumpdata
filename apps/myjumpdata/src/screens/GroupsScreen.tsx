import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AuthVerify from "../common/AuthVerify";
import Button from "../components/Button";
import { TextInput } from "../components/Input";
import { setRoute } from "../redux/route.action";
import {
  createGroup,
  getClub,
  getGroups,
  leaveClub,
} from "../service/groups.service";
import { HiCog } from "react-icons/hi";
import { IoIosLogOut } from "react-icons/io";
import { createTeam, getTeams } from "../service/team.service";

export default function GroupsScreen() {
  useEffect(() => {
    setRoute("group");
    AuthVerify();
  }, []);

  const user = useSelector((state: any) => state.user);
  const { t } = useTranslation();

  const [groups, setGroups] = useState([]);
  const [teams, setTeams] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [club, setClub] = useState<any>();

  const [leave, setLeave] = useState(false);

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
    getTeams().then((response: any) => {
      setTeams(response.data);
    });
  }

  function handleCreateGroup() {
    createGroup(groupName.trim(), club?._id).then(() => {
      getGroupsFN();
      setGroupName("");
    });
  }
  function handleCreateTeam() {
    createTeam(teamName.trim(), club?._id).then(() => {
      getGroupsFN();
      setTeamName("");
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
            <span
              className="cursor-pointer text-2xl"
              onClick={() => {
                setLeave(true);
              }}
            >
              <IoIosLogOut />
            </span>
            {club.admins?.some((i: any) => i._id === user.id) && (
              <Link
                to={`/club/admin`}
                className="flex aspect-square h-8 w-8 items-center justify-center rounded-full text-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-gray-800 dark:focus:ring-offset-white"
              >
                <HiCog />
              </Link>
            )}
          </div>
          <Link
            to={`/club/page/${club._id}`}
            className="flex items-center space-x-2 rounded-xl py-4 px-2 hover:bg-gray-500/50"
          >
            <span className="h-16 w-16">
              <img
                src={club.logo}
                alt={`Logo-${club.name}`}
                className="h-full w-full object-contain"
              />
            </span>
            <div className="flex flex-col">
              <span className="text-xl font-bold">{club.name}</span>
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
          </Link>
        </>
      ) : null}
      <div className="w-full space-y-2">
        <span className="text-xl font-bold">
          {t<string>("common:nav_group")}
        </span>
      </div>
      {club === null ? (
        <div className="flex flex-col">
          <span className="mb-4 text-lg opacity-75">{t("club_notfound")}</span>
          <span className="mb-4 text-lg opacity-75">
            {t("club_notfound_apply")}
          </span>
          <a href="mailto:myjumpdata@gmail.com">myjumpdata@gmail.com</a>
        </div>
      ) : (
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
      )}
      <div className="w-full space-y-2">
        <span className="text-xl font-bold">
          {t<string>("common:nav_team")}
        </span>
      </div>
      {club === null ? null : (
        <>
          <div className="flex flex-col space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 md:grid-cols-3 lg:grid-cols-4">
            {teams?.map((team: any) => (
              <Link
                to={`/team/${team._id}`}
                key={team._id}
                className="flex w-full items-center overflow-hidden overflow-ellipsis rounded-lg bg-gray-300 px-4 py-2 shadow outline-gray-700 hover:bg-gray-200 dark:bg-transparent dark:outline dark:outline-gray-200 dark:hover:bg-gray-800 md:justify-center md:px-8 md:py-4"
              >
                <span className="text-lg font-bold md:text-xl">
                  {team.name}
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
                  {t<string>("common:create_team")}
                </span>
              </div>
              <div className="max-w-screen-sm">
                <TextInput
                  name={t("common:team_name") + ":"}
                  type="text"
                  value={teamName}
                  stateChange={setTeamName}
                />
                <Button
                  name={t("common:create_team")}
                  onClick={handleCreateTeam}
                  design="success"
                />
              </div>
            </>
          ) : null}
        </>
      )}
      <LeaveOverlay />
    </>
  );
  function LeaveOverlay() {
    return (
      <div
        className={
          "top-0 left-0 flex h-full w-full flex-col justify-center p-4 backdrop-blur backdrop-filter " +
          (leave ? "fixed z-50" : "z-0 hidden")
        }
        onClick={() => {
          setLeave(false);
        }}
      >
        <div className="mx-auto flex max-w-prose flex-col space-y-4 rounded-lg bg-gray-300/75 p-4 dark:bg-gray-600/75">
          <span className="text-xl font-bold">
            Are you sure you want to leave this Club?
          </span>
          <Button
            name="Leave"
            design="danger"
            onClick={() => {
              leaveClub().then(() => {
                setLeave(false);
                getGroupsFN();
              });
            }}
          />
        </div>
      </div>
    );
  }
}
