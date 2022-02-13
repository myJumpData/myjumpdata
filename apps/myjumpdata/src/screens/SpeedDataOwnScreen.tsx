import { setRoute } from "@myjumpdata/redux";
import {
  getScoreDataOwn,
  resetScoreDataOwn,
  saveScoreDataOwn,
} from "@myjumpdata/service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiX } from "react-icons/hi";
import AuthVerify from "../common/AuthVerify";
import Button from "../components/Button";
import { DateInput, TextInput } from "../components/Input";
import { SpeedDataInput } from "../parts/SpeedData";

export default function SpeedDataOwnScreen() {
  useEffect(() => {
    setRoute("speeddata");
  }, []);

  AuthVerify();

  const [scoreData, setScoreData] = useState([]);
  const [date, setDate] = useState<Date>(new Date());
  const [showResetDialog, setShowResetDialog] = useState<any>();
  const { t } = useTranslation();

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
      saveScoreDataOwn(type, score, date);
      e.target.elements[type].value = null;
      getData();
    }
  }

  return (
    <div className="w-full space-y-2">
      <span className="text-xl font-bold">{t("common:nav_speeddataown")}</span>
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
                onSubmit={handleRecordDataSubmit}
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
            {t("scoredata_reset_title")}
          </span>
          <span>{t("scoredata_reset_text")}</span>
          <span className="font-bold">{t("scoredata_reset_warning")}</span>
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
            <Button type="submit" name={"Zurücksetzen"} design="danger" />
          </form>
        </div>
      </div>
    </div>
  );
}
