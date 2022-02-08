import * as React from "react";
import { useTranslation } from "react-i18next";
import { Image } from "react-native";
import Logo from "../assets/Logo.png";
import { StyledButton } from "../components/StyledButton";
import { StyledText, StyledTextH1 } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledScrollView, StyledView } from "../components/StyledView";
import AuthService from "../services/auth.service";

export default function LoginScreen() {
  const { t } = useTranslation();
  const [username, onChangeUsername] = React.useState("");
  const [password, onChangePassword] = React.useState("");

  function handleLoginSubmit() {
    AuthService.login(username.trim(), password).then(() => {
      onChangePassword("");
      onChangeUsername("");
    });
  }

  return (
    <StyledScrollView
      style={{
        padding: 10,
      }}
    >
      <StyledView
        style={{
          alignItems: "center",
          height: "30%",
        }}
      >
        <Image
          source={Logo}
          style={{
            height: 200,
          }}
          resizeMode="contain"
        />
      </StyledView>
      <StyledView
        style={{
          alignItems: "center",
        }}
      >
        <StyledTextH1>myJumpData</StyledTextH1>
      </StyledView>
      <StyledView
        style={{
          paddingVertical: 10,
        }}
      >
        <StyledText>{t("common:username")}:</StyledText>
        <StyledTextInput
          onChangeText={onChangeUsername}
          value={username}
          autoCapitalize="none"
          autoCompleteType="username"
          autoFocus
          textContentType="username"
        />
      </StyledView>
      <StyledView
        style={{
          paddingVertical: 10,
        }}
      >
        <StyledText>{t("common:password")}:</StyledText>
        <StyledTextInput
          onChangeText={onChangePassword}
          value={password}
          autoCapitalize="none"
          autoCompleteType="password"
          secureTextEntry
          textContentType="password"
        />
      </StyledView>
      <StyledView
        style={{
          paddingVertical: 10,
        }}
      >
        <StyledButton
          title={t("common:nav_login")}
          onPress={handleLoginSubmit}
        />
      </StyledView>
    </StyledScrollView>
  );
}
