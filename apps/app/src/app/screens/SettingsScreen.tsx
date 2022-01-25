import * as React from "react";
import { useTranslation } from "react-i18next";
import { StyledButton } from "../components/StyledButton";
import { StyledText } from "../components/StyledText";
import { StyledScrollView } from "../components/StyledView";
import { clearUser } from "../redux/user.action";

export default function SettingsScreen() {
  const { t } = useTranslation();
  return (
    <StyledScrollView style={{ padding: 10 }}>
      <StyledText style={{ marginBottom: 40, marginTop: 40 }}>
        {t("settings.app_disclaimer")}
      </StyledText>
      <StyledButton
        onPress={() => {
          clearUser();
        }}
        title={t("settings.logout")}
      />
    </StyledScrollView>
  );
}
