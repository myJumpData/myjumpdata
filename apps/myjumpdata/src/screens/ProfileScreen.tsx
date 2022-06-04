import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { setRoute } from "../redux/route.action";
import { getUserSearch } from "../service/users.service";
import fullname from "../utils/fullname";

export default function ProfileScreen() {
  useEffect(() => {
    setRoute("profile");
  }, []);

  const params = useParams();
  const { t } = useTranslation();

  const [user, setUser] = useState<any>();

  useEffect(() => {
    if (params.username && params.username !== "") {
      getUserSearch(params.username as string).then((response) => {
        setUser(response.data);
      });
    }
  }, [params.username]);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-start space-x-4">
        <div className="flex aspect-square h-24 justify-center sm:h-32 md:h-48">
          <img
            src={
              user?.picture ||
              "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
            }
            className="rounded-full object-cover"
            alt={fullname(user)}
          />
        </div>
        <div className="flex w-full min-w-0 flex-col justify-center">
          <span className="w-full truncate text-xl font-bold md:text-2xl">
            {user?.username}
          </span>
          <div className="truncate text-lg capitalize md:text-2xl">
            {fullname(user)}
          </div>
        </div>
      </div>
      <div>
        <span className="text-lg font-bold md:text-xl">
          {t<string>("common:highscores")}:
        </span>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {user?.highdata?.map(
            (score: { type: string; score: number; scoreOwn: number }) => {
              if (!score.score && !score.scoreOwn) {
                return null;
              }
              return (
                <div
                  className="flex w-full items-center justify-between space-x-4 rounded-lg bg-gray-200 px-4 py-2 shadow dark:bg-gray-800"
                  key={score.type}
                >
                  <span className="w-full text-base font-bold">
                    {score.type}
                  </span>
                  <div className="flex flex-col whitespace-nowrap text-sm">
                    {score.score ? (
                      <div className="flex justify-between space-x-2">
                        <span>{t<string>("common:nav_group")}</span>
                        <span>{score.score}</span>
                      </div>
                    ) : null}
                    {score.scoreOwn ? (
                      <div className="flex justify-between space-x-2">
                        <span>{t<string>("common:own")}</span>
                        <span>{score.scoreOwn}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
