import { Picker } from "@react-native-picker/picker";
import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  Linking,
  RefreshControl,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { StyledButton } from "../components/StyledButton";
import { StyledText } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledScrollView } from "../components/StyledView";
import { Colors } from "../Constants";
import { clearUser, setUser } from "../redux/user.action";
import UsersService from "../services/users.service";

export default function SettingsScreen({ navigation }) {
  const user = useSelector((state: any) => state.user);
  const { t } = useTranslation();
  const isDarkMode = useColorScheme() === "dark";

  const [username, setUsername] = React.useState(user.username);
  const [firstname, setFirstname] = React.useState(user.firstname);
  const [lastname, setLastname] = React.useState(user.lastname);
  const [email, setEmail] = React.useState(user.email);
  const [picture, setPicture] = React.useState<undefined | "gravatar" | "none">(
    user.picture
  );
  const [password, setPassword] = React.useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [editing, setEditing] = React.useState(false);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (editing) {
          return (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{ paddingRight: 5 }}
                onPress={() => {
                  setEditing(false);
                  setRefreshing(true);
                  UsersService.updateUser({}).then((response) => {
                    setUsername(response.data.username);
                    setFirstname(response.data.firstname);
                    setLastname(response.data.lastname);
                    setEmail(response.data.email);
                    setPicture(response.data.picture);
                    setUser(response.data);
                    setRefreshing(false);
                  });
                }}
              >
                <Ionicons name="close-outline" size={40} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingRight: 10, marginTop: -1 }}
                onPress={() => {
                  setEditing(false);
                  setRefreshing(true);
                  const updateData: {
                    username?: string;
                    firstname?: string;
                    lastname?: string;
                    email?: string;
                    picture?: undefined | "none" | "gravatar";
                    password?: string;
                  } = {};
                  if (username !== user.username) {
                    updateData.username = username;
                  }
                  if (firstname !== user.firstname) {
                    updateData.firstname = firstname;
                  }
                  if (lastname !== user.lastname) {
                    updateData.lastname = lastname;
                  }
                  if (email !== user.email) {
                    updateData.email = email;
                  }
                  if (picture !== user.picture) {
                    updateData.picture = picture;
                  }
                  if (password !== "") {
                    updateData.password = password;
                  }
                  UsersService.updateUser(updateData).then((response: any) => {
                    setUsername(response.data.username);
                    setFirstname(response.data.firstname);
                    setLastname(response.data.lastname);
                    setEmail(response.data.email);
                    setPicture(response.data.picture);
                    setPassword("");
                    setUser(response.data);
                    if (updateData.email) {
                      clearUser();
                    }
                    setRefreshing(false);
                  });
                }}
              >
                <Ionicons name="checkmark" size={35} color={Colors.main} />
              </TouchableOpacity>
            </View>
          );
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const onRefresh = React.useCallback(() => {
    setEditing(false);
    UsersService.updateUser({}).then((response) => {
      setUsername(response.data.username);
      setFirstname(response.data.firstname);
      setLastname(response.data.lastname);
      setEmail(response.data.email);
      setPicture(response.data.picture);
      setUser(response.data);
    });
  }, []);

  return (
    <StyledScrollView
      style={{ padding: 10 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ marginBottom: 20 }}>
        <StyledText style={{ fontWeight: "900" }}>
          {t("settings.data")}:
        </StyledText>
        <View style={{ marginVertical: 10 }}>
          <StyledText>{t("common:fields.username")}:</StyledText>
          <StyledTextInput
            onChangeText={(e) => {
              setEditing(true);
              setUsername(e);
            }}
            value={username}
            autoCapitalize="none"
          />
        </View>
        <View style={{ marginVertical: 10 }}>
          <StyledText>{t("common:fields.firstname")}:</StyledText>
          <StyledTextInput
            onChangeText={(e: string) => {
              setEditing(true);
              setFirstname(e);
            }}
            value={firstname}
            autoCapitalize="none"
          />
        </View>
        <View style={{ marginVertical: 10 }}>
          <StyledText>{t("common:fields.lastname")}:</StyledText>
          <StyledTextInput
            onChangeText={(e: string) => {
              setEditing(true);
              setLastname(e);
            }}
            value={lastname}
            autoCapitalize="none"
          />
        </View>
        <View style={{ marginVertical: 10 }}>
          <StyledText>{t("common:fields.email")}:</StyledText>
          <StyledTextInput
            onChangeText={(e: string) => {
              setEditing(true);
              setEmail(e);
            }}
            value={email}
            autoCapitalize="none"
          />
        </View>
        <View style={{ marginVertical: 10 }}>
          <StyledText>{t("common:fields.password")}:</StyledText>
          <StyledTextInput
            onChangeText={(e: string) => {
              setEditing(true);
              setPassword(e);
            }}
            value={password}
            autoCapitalize="none"
          />
        </View>
      </View>
      <View style={{ marginBottom: 20 }}>
        <StyledText style={{ fontWeight: "900" }}>
          {t("settings.image")}:
        </StyledText>
        <StyledText style={{ fontSize: 12 }}>
          {t("settings.image_text")}
        </StyledText>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://gravatar.com/");
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: Colors.main,
              textDecorationLine: "underline",
            }}
          >
            {t("settings.image_action")}
          </Text>
        </TouchableOpacity>
        <Picker
          selectedValue={picture}
          onValueChange={(e) => {
            setEditing(true);
            setPicture(e);
          }}
          style={{
            flex: 1,
            color: isDarkMode ? Colors.white : Colors.black,
          }}
          dropdownIconColor={isDarkMode ? Colors.white : Colors.black}
          mode="dropdown"
        >
          <Picker.Item label={t("settings.image_none")} value={"none"} />
          <Picker.Item
            label={t("settings.image_gravatar")}
            value={"gravatar"}
          />
        </Picker>
      </View>
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
