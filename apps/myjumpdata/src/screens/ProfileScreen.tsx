import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import User from "../assets/user.svg";
import { setRoute } from "../redux/route.action";
import { getUserSearch } from "../service/users.service";

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
          <div className="flex aspect-square h-24 justify-center sm:h-32 md:h-48">
            <img
              src={image}
              className="rounded-full object-cover"
              alt={username}
            />
          </div>
        ) : (
          <div className="flex aspect-square h-24 items-center justify-center rounded-full bg-gray-300 p-4 text-3xl text-gray-700 sm:h-32 sm:text-5xl md:h-48 md:p-8 md:text-9xl">
            <img src={User} alt="user" />
          </div>
        )}
        <div className="flex w-full min-w-0 flex-col justify-center">
          <span className="w-full truncate text-xl font-bold md:text-2xl">
            {username}
          </span>
          <div className="truncate text-lg capitalize md:text-2xl">
            {firstname && lastname ? firstname + " " + lastname : username}
          </div>
        </div>
      </div>
      <div>
        <span className="text-lg font-bold md:text-xl">
          {t<string>("common:highscores")}:
        </span>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {userOverviewScoreData?.map(
            (score: { type: string; score: number; scoreOwn: number }) => (
              <div
                className="flex w-full items-center justify-between space-x-4 rounded-lg bg-gray-200 px-4 py-2 shadow dark:bg-gray-800"
                key={score.type}
              >
                <span className="w-full text-base font-bold">{score.type}</span>
                <div className="flex flex-col whitespace-nowrap text-sm">
                  <div className="flex justify-between space-x-2">
                    <span>{t<string>("common:nav_group")}</span>
                    <span>{score.score}</span>
                  </div>
                  <div className="flex justify-between space-x-2">
                    <span>{t<string>("common:own")}</span>
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
