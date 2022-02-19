import { Picker } from "@react-native-picker/picker";
import React from "react";
import { useColorScheme } from "react-native";
import { borderRadius, Colors } from "../Constants";

export default function SelectInput({
  state,
  setState,
  data,
}: {
  data: {
    name: string | undefined;
    value: string | undefined;
  }[];
  setState: any;
  state: any;
}) {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <Picker
      selectedValue={state}
      onValueChange={setState}
      style={{
        flex: 1,
        color: isDarkMode ? Colors.white : Colors.black,
        borderRadius: borderRadius,
      }}
      dropdownIconColor={isDarkMode ? Colors.white : Colors.black}
      mode="dropdown"
    >
      {data.map((item) => (
        <Picker.Item key={item.value} label={item.name} value={item.value} />
      ))}
    </Picker>
  );
}
