import * as React from "react";
import { Text, TextProps } from "react-native";
import useColorScheme from "react-native/Libraries/Utilities/useColorScheme";
import { Colors, Font } from "../Constants";

export function StyledText(props: TextProps) {
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
export function StyledShyText(props: TextProps) {
  return (
    <Text
      {...props}
      style={[
        {
          color: Colors.grey,
          fontSize: Font.size,
        },
        props.style,
      ]}
    />
  );
}
export function StyledHeading(props: TextProps) {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <Text
      {...props}
      style={[
        {
          marginTop: 10,
          color: isDarkMode ? Colors.white : Colors.black,
          fontSize: 20,
          fontWeight: "700",
        },
        props.style,
      ]}
    />
  );
}
export function StyledTextH1(props: TextProps) {
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
