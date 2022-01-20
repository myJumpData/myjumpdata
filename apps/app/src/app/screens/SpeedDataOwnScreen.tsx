import DateTimePicker from "@react-native-community/datetimepicker";
import * as React from "react";
import { RefreshControl } from "react-native";
import { StyledButton } from "../components/StyledButton";
import { StyledText } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledScrollView, StyledView } from "../components/StyledView";
import { Colors } from "../Constants";
import ScoreDataService from "../services/scoredata.service";

export default function SpeedDataOwnScreen() {
  //const user = useSelector((state: any) => state.user);

  const [scoreData, setScoreData] = React.useState<any>([]);
  const [date, setDate] = React.useState<Date>(new Date());
  const [dateShow, setDateShow] = React.useState<boolean>(false);
  const [dateText, setDateText] = React.useState<string>("");
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    const selected = new Date(date);
    const format = `${selected.getDate().toString().padStart(2, "0")}.${(
      selected.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${selected.getFullYear()}`;
    if (selected.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
      setDateText(`Today (${format})`);
    } else {
      setDateText(`${format}`);
    }
  }, [date]);

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
    <StyledScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <StyledButton
        title={dateText}
        onPress={() => {
          setDateShow(true);
        }}
        style={{ marginBottom: 30 }}
      />
      {dateShow && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={(e: any, d: any) => {
            if (d) {
              setDate(d);
            } else {
              setDate(new Date());
            }
            setDateShow(false);
          }}
        />
      )}

      <StyledView style={{ flex: 1 }}>
        {scoreData.map((item) => (
          <StyledView
            key={item.type._id}
            style={{
              width: "100%",
              borderWidth: 1,
              borderColorBottom: Colors.grey,
              borderColorTop: Colors.grey,
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 5,
              paddingBottom: 5,
              marginBottom: 10,
            }}
          >
            <StyledView
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <StyledText>{item.type.name}</StyledText>
              <StyledText>HIGH: {item.score}</StyledText>
            </StyledView>
            <StyledView
              style={{
                flex: 1,
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <StyledTextInput
                style={{ width: "auto", flexGrow: 1 }}
                keyboardType="numeric"
                onSubmitEditing={({ nativeEvent, target }) => {
                  ScoreDataService.saveScoreDataOwn(
                    item.type._id,
                    nativeEvent.text,
                    date
                  );
                  getData();
                  target.clear();
                }}
              />
            </StyledView>
          </StyledView>
        ))}
      </StyledView>
    </StyledScrollView>
  );
}
