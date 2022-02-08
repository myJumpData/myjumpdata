import { setRoute } from "@myjumpdata/redux";
import {
  getGroup,
  getScoreDataHigh,
  getScoreDataTypes,
  saveScoreData,
} from "@myjumpdata/service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import AuthVerify from "../common/AuthVerify";
import { DateInput, SelectInput } from "../components/Input";
import { SpeedDataInput } from "../parts/SpeedData";

export default function SpeedDataScreen() {
  useEffect(() => {
    setRoute("group");
  }, []);

  AuthVerify();
  const params = useParams();

  const [groupName, setGroupName] = useState("");
  const { t } = useTranslation();
  const [groupScores, setGroupScores] = useState([]);
  const [groupHigh, setGroupHigh] = useState([]);
  const [scoreDataTypes, setScoreDataTypes] = useState([]);
  const [typesOptions, setTypesOptions] = useState([]);
  const [scoreDataType, setScoreDataType] = useState("");
  const [date, setDate] = useState<Date>(new Date());

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
      <span className="font-bold text-xl">
        {t("speeddata.title") + " " + groupName}
      </span>
      <DateInput
        setDate={(e) => {
          setDate(e);
        }}
        date={date}
      />
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-full">
          <SelectInput
            options={typesOptions}
            current={scoreDataType}
            stateChange={setScoreDataType}
          />
        </div>
        <span className="text-xs whitespace-nowrap uppercase">
          {t("common:stats.high")}: {groupHigh}
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
            />
          );
        })}
    </>
  );
}
