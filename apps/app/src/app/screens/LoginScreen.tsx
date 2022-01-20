import * as React from "react";
import { Image } from "react-native";
import Logo from "../assets/skipping-rope.png";
import { StyledButton } from "../components/StyledButton";
import { StyledText, StyledTextH1 } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledView } from "../components/StyledView";
import AuthService from "../services/auth.service";

export default function LoginScreen() {
  const [username, onChangeUsername] = React.useState("");
  const [password, onChangePassword] = React.useState("");

  async function handleLoginSubmit() {
    AuthService.login(username.trim(), password).then(() => {
      onChangePassword("");
      onChangeUsername("");
    });
  }

  return (
    <StyledView
      style={{
        padding: 15,
        justifyContent: "center",
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
          style={{ width: "100%", height: "100%" }}
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
        <StyledText>Benutzername:</StyledText>
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
        <StyledText>Passwort:</StyledText>
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
        <StyledButton title="Anmelden" onPress={handleLoginSubmit} />
      </StyledView>
    </StyledView>
  );
}
