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
          "flex flex-col items-center justify-center w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 group rounded-full shrink-0 relative bg-orange-500"
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
          <span className="backdrop-filter backdrop-blur bg-gray-800 bg-opacity-75 text-white text-xs rounded-lg py-1 px-2 right-0 bottom-full m-4 capitalize whitespace-nowrap">
            {firstname && lastname ? firstname + " " + lastname : username}
          </span>
        </div>
      </Link>
    );
  }

  function UserRow({ list, name }: { list: any; name: string }) {
    return (
      <div className="flex items-center">
        <span className="text-base font-bold pr-4">{name}</span>
        <div className="w-full overflow-x-auto flex space-x-4 sm:overflow-x-visible sm:flex-wrap">
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
          <span className="font-bold text-xl">{groupName}</span>
        </div>
        {groupCoaches?.some((i: any) => i.id === user.id) && (
          <Link
            to={`/group/${params.id}/settings`}
            className="focus:ring-white dark:focus:ring-offset-white focus:ring-offset-gray-800 dark:focus:ring-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full flex items-center justify-center text-2xl aspect-square h-8 w-8"
          >
            <HiCog />
          </Link>
        )}
      </div>
      <div className="space-y-4">
        <UserRow name={t("common:role.coaches")} list={groupCoaches} />
        <UserRow name={t("common:role.athletes")} list={groupAthletes} />
      </div>
      <div>
        {groupCoaches?.some((i: any) => i.id === user.id) && (
          <div className="mb-4">
            <Link to={`/speeddata/group/${params.id}`}>
              <Button name={t("common:action.speeddata")} design="primary" />
            </Link>
            <Link to={`/freestyle/group/${params.id}`}>
              <Button name={t("common:action.freestyle")} design="primary" />
            </Link>
          </div>
        )}
        <Link to={`/group`}>
          <Button name={t("common:interact.back")} design="link" />
        </Link>
      </div>
    </>
  );
}
