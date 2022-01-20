import * as React from "react";
import { TouchableOpacity } from "react-native";
import { borderRadius, Colors } from "../Constants";
import { StyledText } from "./StyledText";
export function StyledButton(props) {
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          borderRadius: borderRadius,
          alignItems: "center",
          backgroundColor: Colors.main,
          height: 50,
          justifyContent: "center",
        },
        props.style,
      ]}
      color={Colors.main}
    >
      <StyledText>{props.title}</StyledText>
      {props.children}
    </TouchableOpacity>
  );
}
