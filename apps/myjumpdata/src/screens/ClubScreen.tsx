import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getClub } from "../service/groups.service";
import Flag from "react-world-flags";
import { useTranslation } from "react-i18next";
import fullname from "../utils/fullname";
import { Outlet } from "react-router-dom";

export default function ClubScreen() {
  const params = useParams();
  const ClubId = params.id;
  const { t } = useTranslation();

  const [club, setClub] = useState<any>();

  useEffect(() => {
    getClub(ClubId).then((response) => {
      setClub(response.data);
    });
  }, [ClubId]);

  function UserCard({ user }) {
    return (
      <div className="flex sm:flex-col sm:items-center sm:justify-center">
        <div className="mr-4 aspect-square h-32 max-h-fit sm:mr-0 sm:mb-4 sm:h-auto sm:max-h-48">
          <img
            src={
              user?.picture !== "" && user?.picture
                ? user.picture
                : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
            }
            className="rounded-full object-cover"
            alt={fullname(user)}
          />
        </div>
        <div className="flex flex-col justify-center text-left sm:text-center">
          <span className="text-lg font-bold capitalize">{fullname(user)}</span>
          <span className="opacity-75">{user.username}</span>
        </div>
      </div>
    );
  }

  if (!club) {
    return <Outlet />;
  }

  return (
    <>
      <div className="flex items-center space-x-2 rounded-xl bg-gray-50/10 py-4 px-2">
        <span className="h-16 w-16">
          <img
            src={club.logo}
            alt={`Logo-${club.name}`}
            className="h-full w-full object-contain"
          />
        </span>
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{club.name}</span>
          <div className="flex items-center space-x-2">
            <span className="flex h-full h-8 w-8 items-center">
              <Flag code={club.country} />
            </span>
            <span className="opacity-75">
              {[club.state, club.city].join(" | ")}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full space-y-2">
        <span className="text-xl font-bold">{t<string>("common:coaches")}</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {club.coaches.map((coach) => (
          <UserCard user={coach} />
        ))}
      </div>
    </>
  );
}
