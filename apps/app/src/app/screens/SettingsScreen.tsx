import * as React from "react";
import { StyledButton } from "../components/StyledButton";
import { StyledView } from "../components/StyledView";
import { clearUser } from "../redux/user.action";

export default function SettingsScreen() {
  return (
    <StyledView
      style={{
        justifyContent: "center",
      }}
    >
      <StyledButton
        onPress={() => {
          clearUser();
        }}
        title="Abmelden"
      />
    </StyledView>
  );
}
