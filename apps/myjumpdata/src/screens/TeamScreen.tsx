import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiCog } from "react-icons/hi";
import { IoIosLogOut } from "react-icons/io";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import AuthVerify from "../common/AuthVerify";
import Button from "../components/Button";
import { setRoute } from "../redux/route.action";
import api from "../service/api";
import { leaveTeam } from "../service/team.service";
import fullname from "../utils/fullname";
import initials from "../utils/initials";

export default function TeamScreen() {
  useEffect(() => {
    setRoute("group");
    AuthVerify();
  }, []);
  const params = useParams();
  const user = useSelector((state: any) => state.user);
  const { t } = useTranslation();
  const [teamName, setTeamName] = useState("");
  const [teamCoaches, setTeamCoaches] = useState([]);
  const [teamAthletes, setTeamAthletes] = useState([]);

  const [leave, setLeave] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getGroupFN();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  function getGroupFN() {
    api.get("/team/" + params.id).then((response: any) => {
      setTeamName(response?.data?.name);
      setTeamCoaches(response?.data?.coaches);
      setTeamAthletes(response?.data?.athletes);
    });
  }

  function UserBlock(user: {
    username: string;
    firstname: string;
    lastname: string;
    picture: string;
  }) {
    return (
      <Link
        to={`/u/${user.username}`}
        className="group relative flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full bg-orange-500 sm:h-14 sm:w-14 md:h-16 md:w-16"
      >
        {user.picture === null ? (
          <span className="text-center uppercase">{initials(user)}</span>
        ) : (
          <img
            className="rounded-full"
            src={user.picture}
            alt={user.username}
          />
        )}
        <div className="absolute hidden group-hover:block group-focus:block">
          <span className="right-0 bottom-full m-4 whitespace-nowrap rounded-lg bg-gray-800 bg-opacity-75 py-1 px-2 text-xs capitalize text-white backdrop-blur backdrop-filter">
            {fullname(user)}
          </span>
        </div>
      </Link>
    );
  }

  function UserRow({ list, name }: { list: any; name: string }) {
    return (
      <div className="flex items-center">
        <span className="pr-4 text-base font-bold">{name}</span>
        <div className="flex w-full space-x-4 overflow-x-auto sm:flex-wrap sm:overflow-x-visible">
          {list?.map((item: any) => (
            <UserBlock
              username={item.username}
              firstname={item.firstname}
              lastname={item.lastname}
              picture={item.picture}
              key={item.username}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center">
        <div className="w-full space-y-2">
          <span className="text-xl font-bold">{teamName}</span>
        </div>
        <span
          className="cursor-pointer text-2xl"
          onClick={() => {
            setLeave(true);
          }}
        >
          <IoIosLogOut />
        </span>
        {teamCoaches?.some((i: any) => i.id === user.id) && (
          <Link
            to={`/team/${params.id}/settings`}
            className="flex aspect-square h-8 w-8 items-center justify-center rounded-full text-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-gray-800 dark:focus:ring-offset-white"
          >
            <HiCog />
          </Link>
        )}
      </div>
      <div className="space-y-4">
        <UserRow name={t("common:coaches")} list={teamCoaches} />
        <UserRow name={t("common:athletes")} list={teamAthletes} />
      </div>
      <div>
        {teamCoaches?.some((i: any) => i.id === user.id) && (
          <div className="mb-4">
            <Link to={`/team/${params.id}/speeddata`}>
              <Button name={t("common:nav_speeddata")} design="primary" />
            </Link>
            <Link to={`/team/${params.id}/player/`}>
              <Button name={t("common:nav_player")} design="primary" />
            </Link>
          </div>
        )}
        <Link to={`/group`}>
          <Button name={t("common:back")} design="link" />
        </Link>
      </div>
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
            Are you sure you want to leave this team?
          </span>
          <Button
            name="Leave"
            design="danger"
            onClick={() => {
              leaveTeam(params.id as string).then(() => {
                setLeave(false);
                navigate("/group");
              });
            }}
          />
        </div>
      </div>
    );
  }
}
