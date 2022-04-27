import * as React from "react";
import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Logo from "../assets/Logo.png";
import { StyledButton } from "../components/StyledButton";
import {
  StyledShyText,
  StyledText,
  StyledTextH1,
} from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledView } from "../components/StyledView";
import { Colors } from "../Constants";
import AuthService from "../services/auth.service";
import getApi from "../utils/getApi";

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const [username, onChangeUsername] = React.useState("");
  const [password, onChangePassword] = React.useState("");

  function handleLoginSubmit() {
    AuthService.login(username.trim(), password).then((res) => {
      if (res.data) {
        onChangePassword("");
        onChangeUsername("");
      }
    });
  }

  return (
    <StyledView
      style={{
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <ScrollView
        style={{
          padding: 10,
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <StyledText style={{ fontWeight: "900", fontSize: 28, padding: 5 }}>
            {t("common:nav_login")}
          </StyledText>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("register");
            }}
          >
            <StyledText
              style={{ color: Colors.main, fontWeight: "900", padding: 5 }}
            >
              {t("common:nav_signup")}
            </StyledText>
          </TouchableOpacity>
        </View>
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
            testId="login_username"
            onChangeText={onChangeUsername}
            value={username}
            autoCapitalize="none"
            autoCompleteType="username"
            textContentType="username"
            accessibilityLabel="username"
          />
        </StyledView>
        <StyledView
          style={{
            paddingVertical: 10,
          }}
        >
          <StyledText>{t("common:password")}:</StyledText>
          <StyledTextInput
            testId="login_password"
            onChangeText={onChangePassword}
            value={password}
            autoCapitalize="none"
            autoCompleteType="password"
            secureTextEntry
            textContentType="password"
            accessibilityLabel="password"
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
      </ScrollView>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StyledShyText>{getApi()}</StyledShyText>
      </View>
    </StyledView>
  );
}
