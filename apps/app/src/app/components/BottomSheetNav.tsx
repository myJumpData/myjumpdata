import React, { RefObject } from "react";
import { useColorScheme, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../Constants";
import BottomSheet, { TouchableOpacity } from "./BottomSheet";
import { StyledText } from "./StyledText";

export function BottomSheetNavElement({
  onPress,
  icon,
  text,
  bsRef,
}: {
  onPress: () => void;
  icon: string;
  text: string;
  bsRef: RefObject<BottomSheet>;
}) {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <TouchableOpacity
      onPress={() => {
        bsRef.current?.close();
        onPress();
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons
          name={icon}
          size={24}
          color={isDarkMode ? Colors.white : Colors.black}
        />
        <StyledText
          style={{ paddingVertical: 12, paddingLeft: 16, lineHeight: 24 }}
        >
          {text}
        </StyledText>
      </View>
    </TouchableOpacity>
  );
}

export function BottomSheetNavList({
  bsRef,
  data,
}: {
  bsRef: RefObject<BottomSheet>;
  data: {
    onPress: () => void;
    icon: string;
    text: string;
  }[];
}) {
  return (
    <>
      {data.map((props, index) => (
        <BottomSheetNavElement key={index} {...props} bsRef={bsRef} />
      ))}
    </>
  );
}
