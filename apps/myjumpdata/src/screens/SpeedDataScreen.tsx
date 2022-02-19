import { setRoute } from "@myjumpdata/redux";
import {
  getGroup,
  getScoreDataHigh,
  getScoreDataTypes,
  resetScoreData,
  saveScoreData,
} from "@myjumpdata/service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiX } from "react-icons/hi";
import { useParams } from "react-router";
import AuthVerify from "../common/AuthVerify";
import Button from "../components/Button";
import { DateInput, SelectInput, TextInput } from "../components/Input";
import { SpeedDataInput } from "../components/SpeedData";

export default function SpeedDataScreen() {
  useEffect(() => {
    setRoute("group");
    AuthVerify();
  }, []);

  const params = useParams();

  const [groupName, setGroupName] = useState("");
  const { t } = useTranslation();
  const [groupScores, setGroupScores] = useState([]);
  const [groupHigh, setGroupHigh] = useState([]);
  const [scoreDataTypes, setScoreDataTypes] = useState([]);
  const [typesOptions, setTypesOptions] = useState([]);
  const [scoreDataType, setScoreDataType] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [showResetDialog, setShowResetDialog] = useState<any>();

  useEffect(() => {
    getGroup(params.id as string).then((response: any) => {
      setGroupName(response.data?.name);
    });
    getScoreDataTypes().then((response: any) => {
      setScoreDataTypes(response.data);
      setScoreDataType(response.data[0]._id);
      getScoreDataHighFN(params.id, response.data[0]._id);
    });
  }, [params]);

  useEffect(() => {
    if (scoreDataType) {
      getScoreDataHighFN(params.id, scoreDataType);
    }
  }, [scoreDataType, params]);

  useEffect(() => {
    const options: any = scoreDataTypes.map((type: any) => {
      return { value: type._id, name: type.name };
    });
    setTypesOptions(options);
  }, [scoreDataTypes]);

  function getScoreDataHighFN(id: any, type: any) {
    getScoreDataHigh(id, type).then((response: any) => {
      setGroupScores(response.data?.scores);
      setGroupHigh(response.data?.high);
    });
  }

  function handleRecordDataSubmit(e: any) {
    e.preventDefault();
    const id = e.target.elements.id.value;
    const score = e.target.elements[id].value;
    saveScoreData(id, scoreDataType, score, date);
    e.target.elements[id].value = null;
    getScoreDataHighFN(params.id, scoreDataType);
  }

  return (
    <>
      <span className="text-xl font-bold">
        {t("speeddata_title") + " " + groupName}
      </span>
      <DateInput
        setDate={(e) => {
          setDate(e);
        }}
        date={date}
      />
      <div className="mb-2 flex items-center space-x-2">
        <div className="w-full">
          <SelectInput
            options={typesOptions}
            current={scoreDataType}
            stateChange={setScoreDataType}
          />
        </div>
        <span className="whitespace-nowrap text-xs uppercase">
          {t("common:high")}: {groupHigh}
        </span>
      </div>
      {groupScores &&
        groupScores.map((score: any) => {
          return (
            <SpeedDataInput
              key={score.user._id}
              id={score.user._id}
              name={
                score.user.firstname && score.user.lastname
                  ? `${score.user.firstname} ${score.user.lastname}`
                  : score.user.username
              }
              score={score.score}
              onSubmit={handleRecordDataSubmit}
              dropdown={[
                {
                  name: t("scoredata_dropdown_reset"),
                  props: {
                    onClick: () => {
                      setShowResetDialog({
                        type: score.type,
                        user: score.user._id,
                        username:
                          score.user.firstname && score.user.lastname
                            ? `${score.user.firstname} ${score.user.lastname}`
                            : score.user.username,
                      });
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
            {t("scoredata_reset_title") + " | " + showResetDialog?.username}
          </span>
          <span>{t("scoredata_reset_text")}</span>
          <span className="font-bold">{t("scoredata_reset_warning")}</span>
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              resetScoreData(
                showResetDialog?.user,
                scoreDataType,
                e.target.elements.score.value
              ).then(() => {
                setShowResetDialog(undefined);
                getScoreDataHighFN(params.id, scoreDataType);
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
    </>
  );
}
