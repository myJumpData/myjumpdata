import { getScoreDataOwn, saveScoreDataOwn } from "@myjumpdata/service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AuthVerify from "../common/AuthVerify";
import { DateInput } from "../components/Input";
import { SpeedDataInput } from "../parts/SpeedData";
import Wrapper from "../parts/Wrapper";

export default function SpeedDataOwnScreen() {
  AuthVerify();

  const [scoreData, setScoreData] = useState([]);
  const [date, setDate] = useState<Date>(new Date());
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
            return (
              score !== null && (
                <SpeedDataInput
                  key={score.type._id}
                  id={score.type._id}
                  name={score.type.name}
                  score={score.score}
                  onSubmit={handleRecordDataSubmit}
                />
              )
            );
          })}
      </div>
    </Wrapper>
  );
}
