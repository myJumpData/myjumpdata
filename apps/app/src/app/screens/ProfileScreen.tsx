import BottomSheet from "@gorhom/bottom-sheet";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Image, Platform, RefreshControl, View } from "react-native";
import DeviceInfo from "react-native-device-info";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { BottomSheetNavList } from "../components/BottomSheetNav";
import StyledBottomSheet from "../components/StyledBottomSheet";
import { StyledText } from "../components/StyledText";
import { StyledView } from "../components/StyledView";
import { borderRadius, Colors } from "../Constants";
import { clearUser } from "../redux/user.action";
import UsersService from "../services/users.service";
import { capitalize } from "../utils/capitalize";
import { useUpdate } from "../components/Update";
import Wrapper from "../components/Wrapper";

export default function ProfileScreen({ route, navigation }) {
  const params = route.params;
  const { t } = useTranslation();
  const user = useSelector((state: any) => state.user);

  const [username, setUsername] = React.useState("");
  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [image, setImage] = React.useState(
    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  );
  const [userOverviewScoreData, setUserOverviewScoreData] = React.useState([]);

  const [refreshing, setRefreshing] = React.useState(false);
  const { newVersion, reloadVersion } = useUpdate();

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => {
    const NavHeight = 200;
    const InfoHeight = 150;
    return [NavHeight, NavHeight + InfoHeight];
  }, []);

  React.useEffect(() => {
    if (!params?.username) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={{ paddingRight: 5 }}
            onPress={() => {
              bottomSheetRef.current?.snapToIndex(0);
            }}
          >
            <Ionicons name="menu-outline" size={40} color={Colors.white} />
          </TouchableOpacity>
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottomSheetRef, params?.username]);

  const getUser = () => {
    UsersService.getUserSearch(params?.username || user.username).then(
      (response) => {
        setUsername(response.data?.username);
        setFirstname(response.data?.firstname);
        setLastname(response.data?.lastname);
        setUserOverviewScoreData(response.data?.highdata);
        setImage(response.data.picture);
        setRefreshing(false);
      }
    );
  };

  React.useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.username, params?.username]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (!params?.username) {
      reloadVersion();
    }
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.username, user.username]);

  return (
    <Wrapper
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      outside={
        <StyledBottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
          <BottomSheetNavList
            bsRef={bottomSheetRef}
            data={[
              {
                onPress: () => {
                  navigation.navigate("settings");
                },
                icon: "settings-outline",
                text: t("common:nav_settings"),
              },
              {
                onPress: () => {
                  navigation.navigate("info");
                },
                icon: "information-circle-outline",
                text: t("common:nav_info"),
              },
              {
                onPress: () => {
                  clearUser();
                },
                icon: "log-out-outline",
                text: t("settings_logout"),
              },
            ]}
          />
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
            <StyledText
              style={{ color: Colors.grey }}
            >{`Server ${newVersion}`}</StyledText>
          </View>
        </StyledBottomSheet>
      }
    >
      <StyledView
        style={{
          flexDirection: "row",
          marginBottom: 10,
        }}
      >
        <Image
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            marginRight: 10,
          }}
          source={{
            uri:
              image ||
              "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
          }}
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
      <StyledView>
        <StyledText style={{ fontWeight: "600" }}>
          {t("common:highscores")}
        </StyledText>
        <StyledView>
          {userOverviewScoreData.map(
            (score: { type: string; score: number; scoreOwn: number }) => {
              if (score.score === 0 && score.scoreOwn === 0) {
                return null;
              }
              return (
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
                    {score.score ? (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <StyledText>{t("common:nav_group")}</StyledText>
                        <StyledText>{score.score}</StyledText>
                      </View>
                    ) : null}
                    {score.scoreOwn ? (
                      <StyledView
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <StyledText>{t("common:own")}</StyledText>
                        <StyledText>{score.scoreOwn}</StyledText>
                      </StyledView>
                    ) : null}
                  </View>
                </StyledView>
              );
            }
          )}
        </StyledView>
      </StyledView>
    </Wrapper>
  );
}
