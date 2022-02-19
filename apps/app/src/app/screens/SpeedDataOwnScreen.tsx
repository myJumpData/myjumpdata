import * as React from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { DateInput } from "../components/Input";
import SpeedDataInput from "../components/SpeedData";
import StyledBottomSheet from "../components/StyledBottomSheet";
import { StyledText } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledView } from "../components/StyledView";
import ScoreDataService from "../services/scoredata.service";

export default function SpeedDataOwnScreen() {
  const { t } = useTranslation();

  const [scoreData, setScoreData] = React.useState<any>([]);
  const [date, setDate] = React.useState<Date>(new Date());
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentType, setCurrentType] = React.useState<any>({});

  const bottomSheet = React.useRef<any>();

  React.useEffect(() => {
    getData();
  }, []);

  function getData() {
    ScoreDataService.getScoreDataOwn().then((response: any) => {
      const tmp = response.data.filter((x) => x !== null);
      setScoreData(tmp);
      setRefreshing(false);
    });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
  }, []);

  return (
    <StyledView
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <DateInput setDate={setDate} date={date} />

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {scoreData.map((item) => {
          return (
            <SpeedDataInput
              key={item.type._id}
              name={item.type.name}
              score={item.score}
              onSubmit={({ nativeEvent, target }) => {
                ScoreDataService.saveScoreDataOwn(
                  item.type._id,
                  nativeEvent.text,
                  date
                ).then(() => {
                  getData();
                });
                target.clear();
              }}
              onReset={() => {
                setCurrentType(item.type);
                bottomSheet.current.show();
              }}
            />
          );
        })}
      </ScrollView>
      <StyledBottomSheet ref={bottomSheet} height={400}>
        <StyledText
          style={{ fontWeight: "900", fontSize: 24, marginBottom: 8 }}
        >
          {t("scoredata_reset_title")}
        </StyledText>
        <StyledText
          style={{ fontWeight: "900", fontSize: 24, marginBottom: 8 }}
        >
          {currentType.name}
        </StyledText>
        <StyledText style={{ marginBottom: 8 }}>
          {t("scoredata_reset_text")}
        </StyledText>
        <StyledText style={{ fontWeight: "900", marginBottom: 16 }}>
          {t("scoredata_reset_warning")}
        </StyledText>
        <StyledTextInput
          style={{ marginBottom: 8 }}
          keyboardType="numeric"
          onSubmitEditing={({ nativeEvent, target }) => {
            ScoreDataService.resetScoreDataOwn(
              currentType._id,
              nativeEvent.text
            ).then(() => {
              bottomSheet.current.close();
              getData();
            });
            target.clear();
          }}
        />
      </StyledBottomSheet>
    </StyledView>
  );
}
