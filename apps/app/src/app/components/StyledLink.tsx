import * as React from "react";
import { Linking, StyleProp, Text, TextStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyledTextStyle } from "./StyledText";

export default function StyledLink({
  url,
  Style = StyledTextStyle,
  children,
}: {
  url: string;
  Style?: () => StyleProp<TextStyle>;
  children: React.ReactNode;
}) {
  const style: TextStyle = Style() as object;
  return (
    <TouchableOpacity
      onPress={() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        Linking.openURL(url).then(() => {});
      }}
    >
      <Text style={[{ textDecorationLine: "underline" }, style]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
