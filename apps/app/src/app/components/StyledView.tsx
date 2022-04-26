import * as React from "react";
import {
  SafeAreaView,
  ScrollView,
  ScrollViewProps,
  View,
  ViewProps,
} from "react-native";
import { SafeAreaViewProps } from "react-native-safe-area-context";
import useColorScheme from "react-native/Libraries/Utilities/useColorScheme";
import { Colors } from "../Constants";

export function StyledView(props: ViewProps) {
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
export function StyledScrollView(props: ScrollViewProps) {
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
export function StyledSafeAreaView(props: SafeAreaViewProps) {
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
