import { StyledView } from "../components/StyledView";
import { TouchableOpacity, View } from "react-native";
import { StyledShyText, StyledText } from "../components/StyledText";
import * as React from "react";
import { useEffect, useState } from "react";
import { borderRadius, Colors } from "../Constants";
import StyledIcon from "../components/StyledIcon";
import Player from "../components/Player";
import { useSelector } from "react-redux";
import fullname from "../utils/fullname";
import ScoreDataService from "../services/scoredata.service";
import { useTranslation } from "react-i18next";

export default function CounterScreen({ navigation, route }) {
  const from = route.params?.from;
  const [count, setCount] = useState(0);

  const { t } = useTranslation();
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ paddingRight: 5 }}
          onPress={() => {
            setCount(0);
          }}
        >
          <StyledIcon name="Ionicons/refresh-outline" size={40} />
        </TouchableOpacity>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return (
    <StyledView style={{ padding: 10 }}>
      {from ? (
        <View style={{ flexDirection: "row" }}>
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
                    from.group
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
              return;
            }}
          >
            <StyledIcon name="Ionicons/checkmark-outline" size={40} />
          </TouchableOpacity>
        </View>
      ) : null}
      <Player />
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
    </StyledView>
  );
}
