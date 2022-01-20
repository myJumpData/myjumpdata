import * as React from "react";
import { TextInput } from "react-native";
import useColorScheme from "react-native/Libraries/Utilities/useColorScheme";
import { borderRadius, Colors } from "../Constants";

export function StyledTextInput(props) {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <TextInput
      {...props}
      style={[
        {
          color: isDarkMode ? Colors.white : Colors.black,
          borderWidth: 1,
          borderColor: isDarkMode ? Colors.white : Colors.black,
          borderRadius: borderRadius,
          width: "100%",
          height: 50,
          paddingVertical: 10,
          paddingHorizontal: 15,
          fontSize: 18,
        },
        props.style,
      ]}
    />
  );
}
