import DateTimePicker from "@react-native-community/datetimepicker";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl, useColorScheme, View } from "react-native";
import BottomSheet from "react-native-gesture-bottom-sheet";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StyledButton } from "../components/StyledButton";
import { StyledText } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledView } from "../components/StyledView";
import { borderRadius, Colors } from "../Constants";
import ScoreDataService from "../services/scoredata.service";

export default function SpeedDataOwnScreen() {
  const { t } = useTranslation();
  const isDarkMode = useColorScheme() === "dark";

  const [scoreData, setScoreData] = React.useState<any>([]);
  const [date, setDate] = React.useState<Date>(new Date());
  const [dateShow, setDateShow] = React.useState<boolean>(false);
  const [dateText, setDateText] = React.useState<string>("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentType, setCurrentType] = React.useState<any>({});

  const bottomSheet = React.useRef<any>();

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
      setDateText(`${t("common:today")} (${format})`);
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
    <StyledView
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

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {scoreData.map((item) => {
          return (
            <StyledView
              key={item.type._id}
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
                  alignItems: "flex-end",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <StyledText
                    style={{
                      fontSize: 24,
                      fontWeight: "900",
                      marginRight: 4,
                    }}
                  >
                    {item.type.name}
                  </StyledText>
                  <TouchableOpacity
                    onPress={() => {
                      setCurrentType(item.type);
                      bottomSheet.current.show();
                    }}
                  >
                    <Ionicons
                      name="ellipsis-vertical"
                      size={24}
                      color={isDarkMode ? Colors.white : Colors.black}
                    />
                  </TouchableOpacity>
                </View>
                <StyledText>
                  {t("common:high")}: {item.score}
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
          );
        })}
      </ScrollView>
      <BottomSheet
        hasDraggableIcon
        ref={bottomSheet}
        height={400}
        radius={borderRadius}
        sheetBackgroundColor={isDarkMode ? Colors.black : Colors.white}
      >
        <View style={{ padding: 20 }}>
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
        </View>
      </BottomSheet>
    </StyledView>
  );
}
