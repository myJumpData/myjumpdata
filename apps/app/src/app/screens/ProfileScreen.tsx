import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Platform,
  RefreshControl,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import DeviceInfo from "react-native-device-info";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import BottomSheetAlt from "../components/BottomSheetAlt";
import Player from "../components/Player";
import { StyledText } from "../components/StyledText";
import { StyledScrollView, StyledView } from "../components/StyledView";
import { borderRadius, Colors } from "../Constants";
import { clearUser } from "../redux/user.action";
import UsersService from "../services/users.service";
import { capitalize } from "../utils/capitalize";

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const user = useSelector((state: any) => state.user);
  const isDarkMode = useColorScheme() === "dark";

  const [username, setUsername] = React.useState("");
  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [image, setImage] = React.useState(
    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  );
  const [userOverviewScoreData, setUserOverviewScoreData] = React.useState([]);

  const [refreshing, setRefreshing] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ paddingRight: 5 }}
          onPress={() => {
            setVisible(true);
          }}
        >
          <Ionicons name="menu-outline" size={40} color={Colors.white} />
        </TouchableOpacity>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    UsersService.getUserSearch(user.username).then((response) => {
      setUsername(response.data?.username);
      setFirstname(response.data?.firstname);
      setLastname(response.data?.lastname);
      setUserOverviewScoreData(response.data?.highdata);
      if (response.data?.picture) {
        fetch(response.data.picture).then((r) => {
          if (r.status === 200) {
            setImage(response.data.picture);
          }
        });
      }
    });
  }, [user.username]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    UsersService.getUserSearch(user.username).then((response) => {
      setUsername(response.data?.username);
      setFirstname(response.data?.firstname);
      setLastname(response.data?.lastname);
      setUserOverviewScoreData(response.data?.highdata);
      if (response.data?.picture) {
        fetch(response.data.picture).then((r) => {
          if (r.status === 200) {
            setImage(response.data.picture);
          }
        });
      }
      setRefreshing(false);
    });
  }, [user.username]);

  return (
    <StyledView>
      <StyledScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <StyledView
          style={{
            flexDirection: "row",
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <Image
            style={{
              width: 150,
              height: 150,
              borderRadius: 75,
              marginRight: 10,
            }}
            source={{ uri: image }}
          />
          <StyledView
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <StyledText style={{ fontWeight: "600" }}>{username}</StyledText>
            <StyledText>
              {capitalize(firstname) + " " + capitalize(lastname)}
            </StyledText>
          </StyledView>
        </StyledView>
        <StyledView
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <StyledText style={{ fontWeight: "600" }}>
            {t("common:highscores")}
          </StyledText>
          <StyledView>
            {userOverviewScoreData.map(
              (score: { type: string; score: number; scoreOwn: number }) => (
                <StyledView
                  key={score.type}
                  style={{
                    width: "100%",
                    borderWidth: 1,
                    borderColor: Colors.grey,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 5,
                    paddingBottom: 5,
                    borderRadius: borderRadius,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <StyledView>
                    <StyledText>{score.type}</StyledText>
                  </StyledView>
                  <View style={{ width: 100 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <StyledText>{t("common:nav_group")}</StyledText>
                      <StyledText>{score.score}</StyledText>
                    </View>
                    <StyledView
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <StyledText>{t("common:own")}</StyledText>
                      <StyledText>{score.scoreOwn}</StyledText>
                    </StyledView>
                  </View>
                </StyledView>
              )
            )}
          </StyledView>
        </StyledView>
      </StyledScrollView>
      <BottomSheetAlt visible={visible} setVisible={setVisible} height={300}>
        <TouchableOpacity
          onPress={() => {
            setVisible(false);
            navigation.navigate("settings");
          }}
        >
          <StyledText style={{ paddingVertical: 10 }}>
            <Ionicons
              name="settings-outline"
              size={24}
              color={isDarkMode ? Colors.white : Colors.black}
            />
            {" " + t("common:nav_settings")}
          </StyledText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setVisible(false);
            navigation.navigate("info");
          }}
        >
          <StyledText style={{ paddingVertical: 10 }}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={isDarkMode ? Colors.white : Colors.black}
            />
            {" " + t("common:nav_info")}
          </StyledText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            clearUser();
          }}
        >
          <StyledText style={{ paddingVertical: 10 }}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color={isDarkMode ? Colors.white : Colors.black}
            />
            {" " + t("settings_logout")}
          </StyledText>
        </TouchableOpacity>
        <View style={{ marginTop: 20 }}>
          <StyledText
            style={{ color: Colors.grey }}
          >{`${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()} - ${DeviceInfo.getBrand()} ${DeviceInfo.getModel()}`}</StyledText>
          <StyledText
            style={{ color: Colors.grey }}
          >{`React Native ${Platform.constants.reactNativeVersion.major}.${Platform.constants.reactNativeVersion.minor}.${Platform.constants.reactNativeVersion.patch}`}</StyledText>
          <StyledText
            style={{ color: Colors.grey }}
          >{`${DeviceInfo.getApplicationName()} ${DeviceInfo.getReadableVersion()}`}</StyledText>
        </View>
      </BottomSheetAlt>
      <View style={{ padding: 10 }}>
        <Player />
      </View>
    </StyledView>
  );
}
