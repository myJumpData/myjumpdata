import React from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../Constants";
import { StyledText } from "./StyledText";
import { StyledTextInput } from "./StyledTextInput";

export default function SpeedDataInput({
  name,
  score,
  onSubmit,
  onReset,
  music,
  counter,
}: {
  name: string;
  score: string;
  onSubmit: any;
  onReset: any;
  music?: any;
  counter?: any;
}) {
  const isDarkMode = useColorScheme() === "dark";
  const { t } = useTranslation();

  return (
    <View
      style={{
        width: "100%",
        padding: 10,
        marginBottom: 10,
      }}
    >
      <View
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
            {name}
          </StyledText>
          <TouchableOpacity onPress={onReset}>
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color={isDarkMode ? Colors.white : Colors.black}
            />
          </TouchableOpacity>
          {music}
          {counter}
        </View>
        <StyledText>
          {t("common:high")}: {score}
        </StyledText>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginTop: 10,
        }}
      >
        <StyledTextInput
          style={{ width: "auto", flexGrow: 1 }}
          keyboardType="numeric"
          onSubmitEditing={onSubmit}
        />
      </View>
    </View>
  );
}
