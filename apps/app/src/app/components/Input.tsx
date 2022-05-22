import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";
import { borderRadius, Colors } from "../Constants";
import { StyledButton } from "./StyledButton";

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

export function DateInput({ setDate, date }: { setDate: any; date: Date }) {
  const [dateShow, setDateShow] = React.useState(false);
  const { t } = useTranslation();

  return (
    <>
      <StyledButton
        title={(() => {
          const selected = new Date(date);
          const format = `${selected.getDate().toString().padStart(2, "0")}.${(
            selected.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}.${selected.getFullYear()}`;
          if (
            selected.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
          ) {
            return `${t("common:today")} (${format})`;
          }
          return `${format}`;
        })()}
        onPress={() => {
          setDateShow(true);
        }}
        style={{ marginBottom: 30 }}
      />
      {dateShow ? (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={(e: any, d: any) => {
            if (d) {
              setDate(d);
            } else {
              setDate(new Date());
            }
            setDateShow(false);
          }}
        />
      ) : null}
    </>
  );
}
