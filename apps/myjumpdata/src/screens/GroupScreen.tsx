import { setRoute } from "@myjumpdata/redux";
import { getGroup } from "@myjumpdata/service";
import { classNames } from "@myjumpdata/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiCog } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import AuthVerify from "../common/AuthVerify";
import Button from "../components/Button";

export default function GroupScreen() {
  useEffect(() => {
    setRoute("group");
  }, []);
  AuthVerify();
  const params = useParams();
  const user = useSelector((state: any) => state.user);
  const { t } = useTranslation();
  const [groupName, setGroupName] = useState("");
  const [groupCoaches, setGroupCoaches] = useState([]);
  const [groupAthletes, setGroupAthletes] = useState([]);

  useEffect(() => {
    getGroupFN();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  function getGroupFN() {
    getGroup(params.id as string).then((response: any) => {
      setGroupName(response?.data?.name);
      setGroupCoaches(response?.data?.coaches);
      setGroupAthletes(response?.data?.athletes);
    });
  }

  function UserBlock({
    username,
    firstname,
    lastname,
    picture,
  }: {
    username: string;
    firstname: string;
    lastname: string;
    picture: string;
  }) {
    return (
      <Link
        to={`/u/${username}`}
        className={classNames(
          "group relative flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full bg-orange-500 sm:h-14 sm:w-14 md:h-16 md:w-16"
        )}
      >
        {picture === null ? (
          <span className="text-center uppercase">
            {firstname && lastname
              ? firstname[0] + lastname[0]
              : username[0] + username.slice(-1)}
          </span>
        ) : (
          <img className="rounded-full" src={picture} alt={username} />
        )}
        <div className="absolute hidden group-hover:block group-focus:block">
          <span className="right-0 bottom-full m-4 whitespace-nowrap rounded-lg bg-gray-800 bg-opacity-75 py-1 px-2 text-xs capitalize text-white backdrop-blur backdrop-filter">
            {firstname && lastname ? firstname + " " + lastname : username}
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
      <div className="flex">
        <div className="w-full space-y-2">
          <span className="text-xl font-bold">{groupName}</span>
        </div>
        {groupCoaches?.some((i: any) => i.id === user.id) && (
          <Link
            to={`/group/${params.id}/settings`}
            className="flex aspect-square h-8 w-8 items-center justify-center rounded-full text-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-gray-800 dark:focus:ring-offset-white"
          >
            <HiCog />
          </Link>
        )}
      </div>
      <div className="space-y-4">
        <UserRow name={t("common:coaches")} list={groupCoaches} />
        <UserRow name={t("common:athletes")} list={groupAthletes} />
      </div>
      <div>
        {groupCoaches?.some((i: any) => i.id === user.id) && (
          <div className="mb-4">
            <Link to={`/speeddata/group/${params.id}`}>
              <Button name={t("common:nav_speeddata")} design="primary" />
            </Link>
            <Link to={`/freestyle/group/${params.id}`}>
              <Button name={t("common:nav_freestyle")} design="primary" />
            </Link>
          </div>
        )}
        <Link to={`/group`}>
          <Button name={t("common:back")} design="link" />
        </Link>
      </div>
    </>
  );
}
