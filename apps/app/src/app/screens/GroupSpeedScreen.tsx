import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl, useColorScheme, View } from "react-native";
import { useSelector } from "react-redux";
import { StyledButton } from "../components/StyledButton";
import { StyledText } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledScrollView, StyledView } from "../components/StyledView";
import { Colors } from "../Constants";
import { setScoredatatype } from "../redux/scoredatatype.action";
import GroupsService from "../services/groups.service";
import ScoreDataService from "../services/scoredata.service";

export default function GroupSpeedScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { id } = route.params;
  const scoredatatype = useSelector((state: any) => state.scoredatatype);

  const [groupScores, setGroupScores] = React.useState([]);
  const [groupHigh, setGroupHigh] = React.useState([]);
  const [scoreDataTypes, setScoreDataTypes] = React.useState([]);
  const [typesOptions, setTypesOptions] = React.useState([]);
  const [date, setDate] = React.useState<Date>(new Date());
  const [dateText, setDateText] = React.useState<string>("");
  const [dateShow, setDateShow] = React.useState<boolean>(false);
  const isDarkMode = useColorScheme() === "dark";

  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    GroupsService.getGroup(id).then((response: any) => {
      navigation.setOptions({ title: response.data.name });
    });
    ScoreDataService.getScoreDataTypes().then((response: any) => {
      setScoreDataTypes(response.data);
      if (scoredatatype === "") {
        setScoredatatype(response.data[0]._id);
        getScoreDataHigh(id, response.data[0]._id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  React.useEffect(() => {
    if (scoredatatype !== "") {
      getScoreDataHigh(id, scoredatatype);
    }
  }, [scoredatatype, id]);

  React.useEffect(() => {
    const options: any = scoreDataTypes.map((type: any) => {
      return { value: type._id, name: type.name };
    });
    setTypesOptions(options);
  }, [scoreDataTypes]);

  function getScoreDataHigh(id: any, type: any) {
    ScoreDataService.getScoreDataHigh(id, type).then((response: any) => {
      setRefreshing(false);
      setGroupScores(response.data?.scores);
      setGroupHigh(response.data?.high);
    });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getScoreDataHigh(id, scoredatatype);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const selected = new Date(date);
    const format = `${selected.getDate().toString().padStart(2, "0")}.${(
      selected.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${selected.getFullYear()}`;
    if (selected.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
      setDateText(`${t("common:today")} (${format})`);
    } else {
      setDateText(`${format}`);
    }
  }, [date]);

  return (
    <StyledScrollView
      style={{ padding: 10 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          margin: 10,
        }}
      >
        <Picker
          selectedValue={scoredatatype}
          onValueChange={(e) => setScoredatatype(e)}
          style={{
            flex: 1,
            color: isDarkMode ? Colors.white : Colors.black,
          }}
          dropdownIconColor={isDarkMode ? Colors.white : Colors.black}
          mode="dropdown"
        >
          {typesOptions.map((type: any) => (
            <Picker.Item
              key={type.value}
              label={type.name}
              value={type.value}
            />
          ))}
        </Picker>
        <StyledText>
          {t("common:high")}: {groupHigh}
        </StyledText>
      </View>

      <StyledView style={{ flex: 1 }}>
        {groupScores?.map((score: any) => (
          <StyledView
            key={score.user._id}
            style={{
              width: "100%",
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
              <StyledText>
                {score.user.firstname && score.user.lastname
                  ? score.user.firstname + " " + score.user.lastname
                  : score.user.username}
              </StyledText>
              <StyledText>
                {t("common:high")}: {score.score}
              </StyledText>
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
                  ScoreDataService.saveScoreData(
                    score.user._id,
                    scoredatatype,
                    nativeEvent.text,
                    date
                  );
                  getScoreDataHigh(id, scoredatatype);
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
