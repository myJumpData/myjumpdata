import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Image, Linking, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Logo from "../assets/Logo.png";
import { StyledButton } from "../components/StyledButton";
import { StyledText, StyledTextH1 } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledScrollView, StyledView } from "../components/StyledView";
import { Colors } from "../Constants";
import AuthService from "../services/auth.service";

export default function RegisterScreen({ navigation }) {
  const { t } = useTranslation();
  const [username, onChangeUsername] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [email, onChangeEmail] = React.useState("");
  const [firstname, onChangeFirstname] = React.useState("");
  const [lastname, onChangeLastname] = React.useState("");
  const [checked, setChecked] = React.useState(false);

  function handleRegisterSubmit() {
    AuthService.register(
      username.trim(),
      firstname.trim(),
      lastname.trim(),
      email.trim(),
      password,
      checked
    ).then(() => {
      navigation.navigate("login");
    });
  }

  return (
    <StyledScrollView
      style={{
        padding: 10,
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
          {t("common:nav_signup")}
        </StyledText>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("login");
          }}
        >
          <StyledText
            style={{ color: Colors.main, fontWeight: "900", padding: 5 }}
          >
            {t("common:nav_login")}
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
          testId="register_username"
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
        <StyledText>{t("common:firstname")}:</StyledText>
        <StyledTextInput
          testId="register_firstname"
          onChangeText={onChangeFirstname}
          value={firstname}
          autoCapitalize="none"
          autoCompleteType="firstname"
          textContentType="name"
          accessibilityLabel="firstname"
        />
      </StyledView>
      <StyledView
        style={{
          paddingVertical: 10,
        }}
      >
        <StyledText>{t("common:lastname")}:</StyledText>
        <StyledTextInput
          testId="register_lastname"
          onChangeText={onChangeLastname}
          value={lastname}
          autoCapitalize="none"
          autoCompleteType="lastname"
          textContentType="familyName"
          accessibilityLabel="lastname"
        />
      </StyledView>
      <StyledView
        style={{
          paddingVertical: 10,
        }}
      >
        <StyledText>{t("common:email")}:</StyledText>
        <StyledTextInput
          testId="register_email"
          onChangeText={onChangeEmail}
          value={email}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          accessibilityLabel="email"
        />
      </StyledView>
      <StyledView
        style={{
          paddingVertical: 10,
        }}
      >
        <StyledText>{t("common:password")}:</StyledText>
        <StyledTextInput
          testId="register_password"
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
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <StyledButton
          title={checked ? <Ionicons name="checkmark" size={30} /> : null}
          style={{
            width: 50,
            height: 50,
            backgroundColor: Colors.main,
            marginRight: 20,
          }}
          onPress={() => {
            setChecked(!checked);
          }}
        />
        <StyledText>
          <Trans i18nKey="common:legal_aprove">
            <StyledText
              style={{ color: Colors.main }}
              onPress={() => {
                Linking.openURL("https://myjumpdata.fediv.me/terms");
              }}
            ></StyledText>
            <StyledText
              style={{ color: Colors.main }}
              onPress={() => {
                Linking.openURL("https://myjumpdata.fediv.me/legal");
              }}
            ></StyledText>
          </Trans>
        </StyledText>
      </StyledView>
      <StyledView
        style={{
          paddingVertical: 20,
          marginBottom: 40,
        }}
      >
        <StyledButton
          title={t("common:nav_signup")}
          style={{ backgroundColor: checked ? Colors.main : Colors.grey }}
          onPress={() => {
            if (checked) {
              handleRegisterSubmit();
            }
          }}
        />
      </StyledView>
    </StyledScrollView>
  );
}
