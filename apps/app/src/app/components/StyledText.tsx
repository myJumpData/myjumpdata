import * as React from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";
import useColorScheme from "react-native/Libraries/Utilities/useColorScheme";
import { Colors, Font } from "../Constants";

export const StyledTextStyle = (): StyleProp<TextStyle> => {
  const isDarkMode = useColorScheme() === "dark";
  return {
    color: isDarkMode ? Colors.white : Colors.black,
    fontSize: Font.size,
  };
};
export function StyledText(props: TextProps) {
  return <Text {...props} style={[StyledTextStyle(), props.style]} />;
}

export const StyledShyTextStyle = (): StyleProp<TextStyle> => {
  return {
    color: Colors.grey,
    fontSize: Font.size,
  };
};
export function StyledShyText(props: TextProps) {
  return <Text {...props} style={[StyledShyTextStyle(), props.style]} />;
}

export const StyledHeadingStyle = (): StyleProp<TextStyle> => {
  const isDarkMode = useColorScheme() === "dark";
  return {
    marginTop: 10,
    color: isDarkMode ? Colors.white : Colors.black,
    fontSize: 20,
    fontWeight: "700",
  };
};
export function StyledHeading(props: TextProps) {
  return <Text {...props} style={[StyledHeadingStyle(), props.style]} />;
}

export const StyledTextH1Style = (): StyleProp<TextStyle> => {
  const isDarkMode = useColorScheme() === "dark";
  return {
    color: isDarkMode ? Colors.white : Colors.black,
    fontSize: Font.sizeH1,
    fontWeight: "700",
  };
};
export function StyledTextH1(props: TextProps) {
  return <Text {...props} style={[StyledTextH1Style(), props.style]} />;
}
