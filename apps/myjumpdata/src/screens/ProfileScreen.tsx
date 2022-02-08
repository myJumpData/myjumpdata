import { setRoute } from "@myjumpdata/redux";
import { getUserSearch } from "@myjumpdata/service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import User from "../assets/user.svg";

export default function ProfileScreen() {
  useEffect(() => {
    setRoute("profile");
  }, []);

  const params = useParams();
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [image, setImage] = useState("");
  const [userOverviewScoreData, setUserOverviewScoreData] = useState([]);

  useEffect(() => {
    setUsername(params.username as string);
  }, [params]);

  useEffect(() => {
    if (username !== undefined && username !== "") {
      getUserSearch(username).then((response) => {
        setUsername(response.data?.username);
        setFirstname(response.data?.firstname);
        setLastname(response.data?.lastname);
        setUserOverviewScoreData(response.data?.highdata);
        if (response.data?.picture) {
          fetch(response.data.picture)
            .then((r) => {
              if (r.status === 200) {
                setImage(response.data.picture);
              }
            })
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            .catch(() => {});
        }
      });
    }
  }, [username]);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-start space-x-4">
        {image !== "" ? (
          <div className="aspect-square h-24 sm:h-32 md:h-48 flex justify-center">
            <img
              src={image}
              className="rounded-full object-cover"
              alt={username}
            />
          </div>
        ) : (
          <div className="bg-gray-300 aspect-square h-24 sm:h-32 md:h-48 flex items-center justify-center text-gray-700 rounded-full text-3xl sm:text-5xl md:text-9xl p-4 md:p-8">
            <img src={User} alt="user" />
          </div>
        )}
        <div className="flex flex-col justify-center w-full min-w-0">
          <span className="font-bold text-xl md:text-2xl w-full truncate">
            {username}
          </span>
          <div className="text-lg md:text-2xl capitalize truncate">
            {firstname && lastname ? firstname + " " + lastname : username}
          </div>
        </div>
      </div>
      <div>
        <span className="font-bold text-lg md:text-xl">
          {t("common:highscores")}:
        </span>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {userOverviewScoreData?.map(
            (score: { type: string; score: number; scoreOwn: number }) => (
              <div
                className="w-full bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-lg shadow space-x-4 flex items-center justify-between"
                key={score.type}
              >
                <span className="font-bold text-base w-full">{score.type}</span>
                <div className="flex-col flex whitespace-nowrap text-sm">
                  <div className="flex justify-between space-x-2">
                    <span>{t("common:nav_group")}</span>
                    <span>{score.score}</span>
                  </div>
                  <div className="flex justify-between space-x-2">
                    <span>{t("common:own")}</span>
                    <span>{score.scoreOwn}</span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
