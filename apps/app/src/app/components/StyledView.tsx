import * as React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import useColorScheme from "react-native/Libraries/Utilities/useColorScheme";
import { Colors } from "../Constants";

export function StyledView(props) {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          flex: 1,
        },
        props.style,
      ]}
    />
  );
}
export function StyledScrollView(props) {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <ScrollView
      {...props}
      style={[
        {
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        },
        props.style,
      ]}
    />
  );
}
export function StyledSafeAreaView(props) {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <SafeAreaView
      {...props}
      style={[
        {
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        },
        props.style,
      ]}
    />
  );
}
