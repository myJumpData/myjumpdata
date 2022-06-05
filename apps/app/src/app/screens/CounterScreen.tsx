import { StyledView } from "../components/StyledView";
import { useColorScheme, View } from "react-native";
import { StyledShyText, StyledText } from "../components/StyledText";
import * as React from "react";
import { useEffect, useState } from "react";
import { borderRadius, Colors } from "../Constants";
import StyledIcon from "../components/StyledIcon";
import { useSelector } from "react-redux";
import fullname from "../utils/fullname";
import ScoreDataService from "../services/scoredata.service";
import { useTranslation } from "react-i18next";
import Wrapper from "../components/Wrapper";
import BottomSheet from "@gorhom/bottom-sheet";
import StyledBottomSheet from "../components/StyledBottomSheet";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledButton } from "../components/StyledButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import api from "../services/api";

export default function CounterScreen({ navigation, route }) {
  const from = route.params?.from;
  const [count, setCount] = useState(0);

  const { t } = useTranslation();
  const user = useSelector((state: any) => state.user);

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => {
    return [300];
  }, []);
  const isDarkMode = useColorScheme() === "dark";

  const [newKey, setNewKey] = React.useState("");
  const [newCode, setNewCode] = React.useState("");

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{ paddingRight: 5 }}
            onPress={() => {
              setCount(0);
            }}
          >
            <StyledIcon name="Ionicons/refresh-outline" size={40} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingRight: 5 }}
            onPress={() => {
              if (newKey === "" || newCode === "") {
                bottomSheetRef.current?.snapToIndex(0);
              } else {
                setNewKey("");
                setNewCode("");
              }
            }}
          >
            <StyledIcon
              name="Ionicons/radio"
              size={40}
              color={
                newKey === "" || newCode === ""
                  ? isDarkMode
                    ? Colors.white
                    : Colors.black
                  : Colors.main
              }
            />
          </TouchableOpacity>
        </View>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newKey, newCode, isDarkMode, bottomSheetRef]);

  React.useEffect(() => {
    if (newKey !== "" && newCode !== "") {
      api
        .post("/live/counter/set", {
          key: newKey,
          code: newCode,
          count: count,
        })
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .then(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, newCode, newKey]);

  return (
    <Wrapper
      as={StyledView}
      outside={
        <StyledBottomSheet snapPoints={snapPoints} ref={bottomSheetRef}>
          <StyledShyText>Key:</StyledShyText>
          <StyledTextInput
            value={newKey}
            onChangeText={setNewKey}
            autoCapitalize="none"
          />
          <StyledShyText>Code:</StyledShyText>
          <StyledTextInput
            value={newCode}
            onChangeText={setNewCode}
            autoCapitalize="none"
          />
          <View style={{ paddingTop: 20 }}>
            <StyledButton
              title="Connect"
              onPress={() => {
                bottomSheetRef.current?.close();
              }}
            />
          </View>
        </StyledBottomSheet>
      }
    >
      {from ? (
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flexGrow: 1,
              paddingRight: 5,
            }}
          >
            <View style={{ justifyContent: "space-between" }}>
              <StyledText style={{ fontSize: 25, fontWeight: "bold" }}>
                {from.type}
              </StyledText>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <StyledIcon
                  name={
                    from.group || from.team
                      ? "Ionicons/people-outline"
                      : "Ionicons/body-outline"
                  }
                  size={24}
                  color={Colors.grey}
                />
                <StyledShyText style={{ paddingLeft: 5 }}>
                  {from.user ? fullname(user) : from.name}
                </StyledShyText>
              </View>
            </View>
            <StyledShyText>
              {t("common:high")}: {from.high}
            </StyledShyText>
          </View>
          <TouchableOpacity
            style={{ paddingLeft: 5 }}
            onPress={() => {
              if (from.group) {
                ScoreDataService.saveScoreData(
                  from.user_id,
                  from.type_id,
                  count,
                  new Date()
                ).then(() => {
                  setCount(0);
                  navigation.goBack();
                });
              }
              if (from.user) {
                ScoreDataService.saveScoreDataOwn(
                  from.type_id,
                  count,
                  new Date()
                ).then(() => {
                  setCount(0);
                  navigation.goBack();
                });
              }
              if (from.team) {
                api
                  .post("/scoredata/team/" + from.team_id, {
                    score: count,
                    type: from.type_id,
                    date: new Date(),
                  })
                  .then(() => {
                    setCount(0);
                    navigation.goBack();
                  });
              }
              return;
            }}
          >
            <StyledIcon name="Ionicons/checkmark-outline" size={40} />
          </TouchableOpacity>
        </View>
      ) : null}
      {newKey === "" || newCode === "" ? null : (
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              backgroundColor: Colors.grey,
              borderRadius: borderRadius,
              paddingVertical: 4,
              paddingHorizontal: 8,
            }}
          >
            <StyledText>{newKey}</StyledText>
          </View>
        </View>
      )}
      <View
        style={{
          alignItems: "flex-end",
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        <StyledText style={{ fontSize: 75, fontWeight: "bold" }}>
          {count}
        </StyledText>
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => {
            if (count > 0) {
              setCount(count - 1);
            }
          }}
          style={{
            width: 50,
            borderColor: Colors.grey,
            borderWidth: 1,
            justifyContent: "center",
            padding: 10,
            alignItems: "center",
            borderRadius: borderRadius,
            marginBottom: 10,
          }}
        >
          <StyledText style={{ fontSize: 24, fontWeight: "bold" }}>
            -1
          </StyledText>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          setCount(count + 1);
        }}
        style={{
          backgroundColor: Colors.grey,
          justifyContent: "center",
          padding: 10,
          alignItems: "center",
          height: 150,
          borderRadius: borderRadius,
          marginBottom: 10,
        }}
      >
        <StyledText style={{ fontSize: 24, fontWeight: "bold" }}>+1</StyledText>
      </TouchableOpacity>
    </Wrapper>
  );
}
