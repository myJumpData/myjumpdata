import {
  getGroup,
  getScoreDataHigh,
  getScoreDataTypes,
  saveScoreData,
} from "@myjumpdata/service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiPlus } from "react-icons/hi";
import { useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";
import AuthVerify from "../common/AuthVerify";
import { DateInput, SelectInput, TextInput } from "../components/Input";
import Wrapper from "../parts/Wrapper";

export default function SpeedDataScreen() {
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
    <Wrapper current="speeddata_group">
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
          const rand = uuidv4();
          return (
            <div
              key={score.id + rand}
              className="border-t border-gray-300 dark:border-gray-700 py-2"
            >
              <div className="flex items-center space-x-2">
                <label
                  className="text-xl font-bold mr-auto leading-none translate-y-2 truncate capitalize"
                  htmlFor={score.user._id}
                >
                  {score.user.firstname && score.user.lastname
                    ? score.user.firstname + " " + score.user.lastname
                    : score.user.username}
                </label>
                <span className="text-xs whitespace-nowrap uppercase">
                  {t("common:stats.high")}: {score.score}
                </span>
              </div>
              <form onSubmit={handleRecordDataSubmit}>
                <input type="hidden" name="id" value={score.user._id} />
                <div className="flex items-center space-x-2">
                  <TextInput
                    type="number"
                    inline
                    min="0"
                    inputName={score.user._id}
                  />
                  <button
                    className="h-10 w-10 bg-yellow-500 dark:bg-yellow-700 flex justify-center items-center text-xl rounded"
                    type="submit"
                    aria-label="submit"
                  >
                    <HiPlus />
                  </button>
                </div>
              </form>
            </div>
          );
        })}
    </Wrapper>
  );
}
