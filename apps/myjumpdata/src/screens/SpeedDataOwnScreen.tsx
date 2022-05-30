import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiX } from "react-icons/hi";
import player from "react-web-track-player";
import AuthVerify from "../common/AuthVerify";
import Button from "../components/Button";
import { DateInput, TextInput } from "../components/Input";
import { SpeedDataInput } from "../components/SpeedData";
import { setRoute } from "../redux/route.action";
import {
  getScoreDataOwn,
  resetScoreDataOwn,
  saveScoreDataOwn,
} from "../service/scoredata.service";
import TRACKS, { musicData } from "../tracks";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { IoArrowForward, IoMenu } from "react-icons/all";

export default function SpeedDataOwnScreen() {
  useEffect(() => {
    setRoute("speeddata");
    AuthVerify();
  }, []);

  const [scoreData, setScoreData] = useState([]);
  const [date, setDate] = useState<Date>(new Date());
  const [showResetDialog, setShowResetDialog] = useState<any>();
  const { t } = useTranslation();
  const [modal, setModal] = useState<any>(null);

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    getScoreDataOwn().then((response: any) => {
      setScoreData(response.data);
    });
  }

  function handleRecordDataSubmit(e: any) {
    e.preventDefault();
    const type = e.target.elements.id.value;
    const score = e.target.elements[type].value;
    if (score !== "") {
      saveScoreDataOwn(type, score, date).then(() => {
        e.target.elements[type].value = null;
        getData();
      });
    }
  }
  const { width, height } = useWindowSize();

  return (
    <div className="w-full space-y-2">
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
            <div className="mx-auto flex max-w-prose flex-col justify-center space-y-4 rounded-lg bg-gray-300/75 p-4 text-center dark:bg-gray-600/75">
              <span className="text-xl font-bold">{modal.name}</span>
              <div className="flex items-center justify-center">
                <span className="text-xl font-bold">{modal.old}</span>
                {Number(modal.old) < Number(modal.new) ? (
                  <IoArrowForward />
                ) : (
                  <IoMenu />
                )}
                <span className="text-xl font-bold">{modal.new}</span>
              </div>
            </div>
          </div>
          <Confetti width={width} height={height} />
        </>
      ) : null}
      <span className="text-xl font-bold">
        {t<string>("common:nav_speeddataown")}
      </span>
      <DateInput
        setDate={(e) => {
          setDate(e);
        }}
        date={date}
      />
      {scoreData &&
        scoreData.map((score: any) => {
          return (
            score !== null && (
              <SpeedDataInput
                key={score.type._id}
                id={score.type._id}
                name={score.type.name}
                score={score.score}
                onSubmit={(e) => {
                  const type = e.target.elements.id.value;
                  const score_new = e.target.elements[type].value;
                  if (Number(score_new) >= score.score) {
                    setModal({
                      old: score.score,
                      new: Number(score_new),
                      name: score.type.name,
                    });
                  }
                  handleRecordDataSubmit(e);
                }}
                dropdown={[
                  {
                    name: t("scoredata_dropdown_reset"),
                    props: {
                      onClick: () => {
                        setShowResetDialog({
                          type: score.type,
                        });
                      },
                    },
                  },
                ]}
                music={
                  musicData[score.type._id] &&
                  musicData[score.type._id].tracks.length > 0
                    ? TRACKS.filter((e) =>
                        musicData[score.type._id].tracks.some(
                          (id) => id === e.id
                        )
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
              />
            )
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
            {t<string>("scoredata_reset_title")}
          </span>
          <span>{t<string>("scoredata_reset_text")}</span>
          <span className="font-bold">
            {t<string>("scoredata_reset_warning")}
          </span>
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              resetScoreDataOwn(
                showResetDialog?.type._id,
                e.target.elements.score.value
              ).then(() => {
                setShowResetDialog(undefined);
                getData();
              });
            }}
          >
            <input type="hidden" name="id" value={showResetDialog?.type._id} />
            <div className="flex items-center space-x-2">
              <TextInput type="number" min="0" inputName="score" />
            </div>
            <Button
              type="submit"
              name={t("scoredata_reset_title")}
              design="danger"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
