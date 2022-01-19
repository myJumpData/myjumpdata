import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiPlus } from "react-icons/hi";
import { v4 as uuidv4 } from "uuid";
import AuthVerify from "../common/AuthVerify";
import { DateInput, TextInput } from "../components/Input";
import Wrapper from "../parts/Wrapper";
import ScoreDataService from "../services/scoredata.service";

export default function SpeedDataOwnScreen() {
  AuthVerify();

  const [scoreData, setScoreData] = useState([]);
  const [date, setDate] = useState<Date>(new Date());
  const { t } = useTranslation();

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    ScoreDataService.getScoreDataOwn().then((response: any) => {
      setScoreData(response.data);
    });
  }

  function handleRecordDataSubmit(e: any) {
    e.preventDefault();
    const score = e.target.elements.score.value;
    const type = e.target.elements.id.value;
    if (score !== "") {
      ScoreDataService.saveScoreDataOwn(type, score, date);
      e.target.elements.score.value = null;
      getData();
    }
  }

  return (
    <Wrapper current="speeddata">
      <div className="w-full space-y-2">
        <span className="font-bold text-xl">
          {t("common:action.speeddataown")}
        </span>
        <DateInput
          setDate={(e) => {
            setDate(e);
          }}
          date={date}
        />
        {scoreData &&
          scoreData.map((score: any) => {
            const rand = uuidv4();
            return (
              score !== null && (
                <div
                  key={score.type._id}
                  className="border-t border-gray-300 dark:border-gray-700 py-2"
                >
                  <div className="flex items-end space-x-2">
                    <label
                      className="text-xl font-bold mr-auto leading-none translate-y-2"
                      htmlFor={"score-" + rand}
                    >
                      {score.type.name}
                    </label>
                    <span className="text-xs whitespace-nowrap uppercase leading-none">
                      {t("common:stats.high")}: {score.score}
                    </span>
                  </div>
                  <form onSubmit={handleRecordDataSubmit}>
                    <input type="hidden" name="id" value={score.type._id} />
                    <div className="flex items-center space-x-2">
                      <TextInput
                        type="number"
                        inline
                        min="0"
                        inputName={"score-" + rand}
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
              )
            );
          })}
      </div>
    </Wrapper>
  );
}
