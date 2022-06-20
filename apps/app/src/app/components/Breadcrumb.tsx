import { t } from "i18next";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../Constants";
import { setFreestyle } from "../redux/freestyle.action";

export default function Breadcrumb({
  data,
  setState,
}: {
  data: any[];
  setState: any;
}) {
  return (
    <View
      style={{
        padding: 10,
        flexDirection: "row",
        alignContent: "center",
        flexWrap: "wrap",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setFreestyle("");
        }}
        style={{
          justifyContent: "center",
        }}
      >
        <Ionicons name={"home"} size={20} color={Colors.grey} />
      </TouchableOpacity>
      {data.map((e, index, array) => {
        const last = index + 1 === array.length;
        return (
          <React.Fragment key={index}>
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <Ionicons name="chevron-forward" size={20} color={Colors.grey} />
            </View>
            <TouchableOpacity
              key={index}
              onPress={() => {
                setState(data.splice(0, index + 1).join("_"));
              }}
              style={{
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.grey,
                  fontWeight: last ? "900" : "400",
                  transform: [
                    { scale: last ? 1.2 : 1 },
                    { translateY: last ? -0.5 : 0 },
                    { translateX: last ? 2 : 0 },
                  ],
                }}
              >
                {t<string>(`freestyle:${e}`)}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
    </View>
  );
}
