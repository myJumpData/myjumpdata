import { StyledView } from "../components/StyledView";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import { StyledText } from "../components/StyledText";
import { useTranslation } from "react-i18next";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as React from "react";
import { Colors } from "../Constants";

export default function TrainScreen({ navigation }) {
  const { t } = useTranslation();
  const isDarkMode = useColorScheme() === "dark";

  return (
    <StyledView style={{ flex: 1, padding: 10 }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("freestyle");
        }}
        style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Ionicons
          name="list-outline"
          size={60}
          color={isDarkMode ? Colors.white : Colors.black}
        />
        <StyledText style={{ fontSize: 24, paddingTop: 20 }}>
          {t("common:nav_freestyle")}
        </StyledText>
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: Colors.grey,
          height: 2,
          width: "100%",
          opacity: 0.5,
        }}
      ></View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("speed_data");
        }}
        style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Ionicons
          name="timer-outline"
          size={60}
          color={isDarkMode ? Colors.white : Colors.black}
        />
        <StyledText style={{ fontSize: 24, paddingTop: 20 }}>
          {t("common:nav_speeddata")}
        </StyledText>
      </TouchableOpacity>
    </StyledView>
  );
}
