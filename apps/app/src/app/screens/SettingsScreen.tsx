import * as React from "react";
import { StyledButton } from "../components/StyledButton";
import { StyledText } from "../components/StyledText";
import { StyledScrollView } from "../components/StyledView";
import { clearUser } from "../redux/user.action";

export default function SettingsScreen() {
  return (
    <StyledScrollView style={{ padding: 10 }}>
      <StyledText style={{ marginBottom: 40, marginTop: 40 }}>
        Für mehr einstellungen benutze bitte die Webversion von myJumpData
      </StyledText>
      <StyledButton
        onPress={() => {
          clearUser();
        }}
        title="Abmelden"
      />
    </StyledScrollView>
  );
}
