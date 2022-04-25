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
import BottomSheetAlt from "../components/BottomSheetAlt";
import Player from "../components/Player";
import { StyledButton } from "../components/StyledButton";
import { StyledText } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledScrollView, StyledView } from "../components/StyledView";
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
  const [visible, setVisible] = React.useState(false);

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
    <StyledView>
      <StyledScrollView
        style={{ padding: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ marginBottom: 20 }}>
          <StyledText style={{ fontWeight: "900" }}>
            {t("settings_data")}:
          </StyledText>
          <View style={{ marginVertical: 10 }}>
            <StyledText>{t("common:username")}:</StyledText>
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
            <StyledText>{t("common:firstname")}:</StyledText>
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
            <StyledText>{t("common:lastname")}:</StyledText>
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
            <StyledText>{t("common:email")}:</StyledText>
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
            <StyledText>{t("common:password")}:</StyledText>
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
            {t("settings_image")}:
          </StyledText>
          <StyledText style={{ fontSize: 12 }}>
            {t("settings_image_text")}
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
              {t("settings_image_action")}
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
            <Picker.Item label={t("settings_image_none")} value={"none"} />
            <Picker.Item
              label={t("settings_image_gravatar")}
              value={"gravatar"}
            />
          </Picker>
        </View>
        <View style={{ marginBottom: 20 }}>
          <StyledText style={{ fontWeight: "900" }}>
            {t("settings_danger")}:
          </StyledText>
          <StyledButton
            onPress={() => {
              clearUser();
            }}
            title={t("settings_logout")}
          />
          <StyledButton
            style={{ marginTop: 80 }}
            onPress={() => {
              setVisible(true);
            }}
            title={t("settings_delete")}
          />
        </View>
        <BottomSheetAlt visible={visible} setVisible={setVisible} height={300}>
          <StyledText
            style={{ fontWeight: "900", fontSize: 24, marginBottom: 8 }}
          >
            {t("settings_delete_disclaimer_title")}
          </StyledText>
          <StyledText style={{ marginBottom: 8 }}>
            {t("settings_delete_disclaimer_text")}
          </StyledText>
          <StyledButton
            style={{ marginTop: 30 }}
            title={t("settings_delete_disclaimer_confirm")}
            onPress={() => {
              UsersService.deleteUser().then((response: any) => {
                if (response.status === 200) {
                  setVisible(false);
                  clearUser();
                }
              });
            }}
          />
        </BottomSheetAlt>
      </StyledScrollView>
      <View style={{ padding: 10 }}>
        <Player />
      </View>
    </StyledView>
  );
}
