import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiX } from "react-icons/hi";
import { useParams } from "react-router";
import player from "react-web-track-player";
import AuthVerify from "../common/AuthVerify";
import Button from "../components/Button";
import { DateInput, TextInput } from "../components/Input";
import { SpeedDataInput } from "../components/SpeedData";
import { setRoute } from "../redux/route.action";
import TRACKS, { musicData } from "../tracks";
import { useWindowSize } from "react-use";
import { IoArrowForward, IoMenu } from "react-icons/all";
import Confetti from "react-confetti";
import { getTeam } from "../service/team.service";
import api from "../service/api";

export default function TeamSpeedScreen() {
  useEffect(() => {
    setRoute("group");
    AuthVerify();
  }, []);

  const params = useParams();

  const [teamName, setTeamName] = useState("");
  const { t } = useTranslation();
  const [scoreDataRecords, setScoreDataRecords] = useState([]);
  const [date, setDate] = useState<Date>(new Date());
  const [showResetDialog, setShowResetDialog] = useState<any>();
  const { width, height } = useWindowSize();
  const [modal, setModal] = useState<any>(null);

  const getData = () => {
    getTeam(params.id as string).then((response: any) => {
      setTeamName(response.data?.name);
    });
    api.get("/scoredata/team/" + params.id).then((response: any) => {
      setScoreDataRecords(response.data);
    });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <>
      {modal ? (
        <>
          <div
            className={
              "fixed top-0 left-0 z-50 flex h-full w-full flex-col justify-center p-4 backdrop-blur backdrop-filter"
            }
            onClick={() => {
              setModal(null);
            }}
          >
            <div className="mx-auto flex max-w-prose flex-col justify-center space-y-2 rounded-lg bg-gray-300/75 p-4 text-center dark:bg-gray-600/75">
              <span className="text-xl font-bold leading-none">
                {modal.type}
              </span>
              <div className="flex items-center justify-center">
                <span className="text-xl font-bold leading-none">
                  {modal.old}
                </span>
                {Number(modal.old) < Number(modal.new) ? (
                  <IoArrowForward />
                ) : (
                  <IoMenu />
                )}
                <span className="text-xl font-bold leading-none">
                  {modal.new}
                </span>
              </div>
            </div>
          </div>
          <Confetti width={width} height={height} />
        </>
      ) : null}
      <span className="text-xl font-bold">
        {t("speeddata_title") + " " + teamName}
      </span>
      <div className="flex items-center">
        <div className="shrink grow">
          <DateInput
            setDate={(e) => {
              setDate(e);
            }}
            date={date}
          />
        </div>
      </div>
      {scoreDataRecords.map((data: any) => {
        return (
          <SpeedDataInput
            key={data.type._id}
            id={data.type._id}
            name={data.type.name}
            score={data.score}
            music={
              musicData[data.type._id] &&
              musicData[data.type._id].tracks.length > 0
                ? TRACKS.filter((e) =>
                    musicData[data.type._id].tracks.some((id) => id === e.id)
                  ).map((t) => ({
                    name: t.title,
                    props: {
                      onClick: async () => {
                        await player.reset();
                        await player.add([t]);
                        await player.play();
                      },
                    },
                  }))
                : undefined
            }
            onSubmit={(e) => {
              e.preventDefault();
              const score_new = e.target.elements[data.type._id].value;
              if (Number(score_new) >= Number(data.score)) {
                setModal({
                  old: data.score,
                  type: data.type.name,
                  new: Number(score_new),
                });
              }

              const id = e.target.elements.id.value;
              const score = e.target.elements[id].value;
              api
                .post("/scoredata/team/" + params.id, {
                  score,
                  type: data.type._id,
                  date,
                })
                .then(() => {
                  getData();
                  e.target.elements[id].value = null;
                });
            }}
            dropdown={[
              {
                name: t("scoredata_dropdown_reset"),
                props: {
                  onClick: () => {
                    /*setShowResetDialog({
                        type: type,
                        user: user.id,
                        username: capitalize(fullname(user)),
                      });*/
                  },
                },
              },
            ]}
          />
        );
      })}
      <div
        className={
          "top-0 left-0 flex h-full w-full flex-col justify-center p-4 backdrop-blur backdrop-filter " +
          (showResetDialog ? "fixed z-50" : "z-0 hidden")
        }
      >
        <div className="relative mx-auto flex min-w-[16rem] max-w-prose flex-col space-y-2 rounded-lg bg-gray-500/25 p-4">
          <span
            className="absolute -right-12 -top-12 cursor-pointer p-8"
            onClick={() => {
              setShowResetDialog(undefined);
            }}
          >
            <HiX />
          </span>
          <span className="text-xl font-bold">
            {t<string>("scoredata_reset_title") +
              " | " +
              showResetDialog?.username}
          </span>
          <span>{t<string>("scoredata_reset_text")}</span>
          <span className="font-bold">
            {t<string>("scoredata_reset_warning")}
          </span>
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              /*resetScoreData(
                showResetDialog?.user,
                scoreDataType,
                e.target.elements.score.value
              ).then(() => {
                setShowResetDialog(undefined);
              });*/
            }}
          >
            <input type="hidden" name="id" value={showResetDialog?.type._id} />
            <div className="flex items-center space-x-2">
              <TextInput type="number" min="0" inputName="score" />
            </div>
            <Button type="submit" name={"Zurücksetzen"} design="danger" />
          </form>
        </div>
      </div>
    </>
  );
}
