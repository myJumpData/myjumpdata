import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../Constants";
import { StyledText } from "./StyledText";

export default function Freestyle({
  item,
  element,
  onSubmit,
  onNavigate,
  type,
}: {
  item: any;
  element?: any;
  onSubmit?: any;
  onNavigate?: any;
  type: "element" | "navigate";
}) {
  const { t } = useTranslation();
  if (type === "element") {
    return (
      <TouchableOpacity
        style={{
          padding: 10,

          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onPress={onSubmit}
      >
        <View
          style={{
            marginRight: 10,
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome
            name={
              element?.stateCoach
                ? "square"
                : element?.stateUser
                ? "check-square"
                : "square-o"
            }
            size={element?.stateCoach ? 35 : element?.stateUser ? 35 : 40}
            color={Colors.main}
          />
        </View>
        <View style={{ flexGrow: 1 }}>
          {item.level ? (
            <Text style={{ fontSize: 12, color: Colors.grey }}>
              Lvl. {item.level}
            </Text>
          ) : null}
          <StyledText>
            {item.compiled
              ? item.key
                  .split("_")
                  .map((i) => t(`freestyle:${i}`))
                  .join(" ")
              : t(`freestyle:${item.key}`)}
          </StyledText>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      style={{
        padding: 10,

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onPress={onNavigate}
    >
      <View
        style={{
          marginRight: 10,
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons
          name={item.back ? "return-up-back" : "folder-outline"}
          size={item.back ? 30 : 40}
          color={Colors.main}
        />
      </View>
      <View style={{ flexGrow: 1 }}>
        <StyledText>
          {item.back
            ? t("common:back")
            : t(
                `freestyle:${
                  item.key.split("_")[item.key.split("_").length - 1]
                }`
              )}
        </StyledText>
      </View>
    </TouchableOpacity>
  );
}
