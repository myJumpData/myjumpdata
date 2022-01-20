import * as React from "react";
import { Text } from "react-native";
import useColorScheme from "react-native/Libraries/Utilities/useColorScheme";
import { Colors, Font } from "../Constants";

export function StyledText(props) {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <Text
      {...props}
      style={[
        {
          color: isDarkMode ? Colors.white : Colors.black,
          fontSize: Font.size,
        },
        props.style,
      ]}
    />
  );
}
export function StyledTextH1(props) {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <Text
      {...props}
      style={[
        {
          color: isDarkMode ? Colors.white : Colors.black,
          fontSize: Font.sizeH1,
          fontWeight: "700",
        },
        props.style,
      ]}
    />
  );
}
