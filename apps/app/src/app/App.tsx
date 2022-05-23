import BottomSheet from "@gorhom/bottom-sheet";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import * as React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Linking, LogBox, ToastAndroid, useColorScheme } from "react-native";
import DeviceInfo from "react-native-device-info";
import TrackPlayer, { Capability, RepeatMode } from "react-native-track-player";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import StyledBottomSheet from "./components/StyledBottomSheet";
import { StyledButton } from "./components/StyledButton";
import { StyledText } from "./components/StyledText";
import { Colors } from "./Constants";
import { setNavigation } from "./redux/navigation.action";
import { setUser } from "./redux/user.action";
import FreestyleScreen from "./screens/FreestyleScreen";
import GroupCreateScreen from "./screens/GroupCreateScreen";
import GroupFreestyleScreen from "./screens/GroupFreestyleScreen";
import GroupScoreScreen from "./screens/GroupScoreScreen";
import GroupSettingsDataScreen from "./screens/GroupSettingsDataScreen";
import GroupSettingsUsersScreen from "./screens/GroupSettingsUsersScreen";
import GroupSpeedScreen from "./screens/GroupSpeedScreen";
import GroupsScreen from "./screens/GroupsScreen";
import InfoScreen from "./screens/InfoScreen";
import LoginScreen from "./screens/LoginScreen";
import PlayerScreen from "./screens/PlayerScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RegisterScreen from "./screens/RegisterScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SpeedDataOwnScreen from "./screens/SpeedDataOwnScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import UsersService from "./services/users.service";
import getApi from "./utils/getApi";
import TrainScreen from "./screens/TrainScreen";
import CounterScreen from "./screens/CounterScreen";

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

export default function App() {
  const user = useSelector((state: any) => state.user);
  const navigation = useSelector((state: any) => state.navigation);

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => [200], []);

  const bottomSheetRefUpdate = React.useRef<BottomSheet>(null);
  const snapPointsUpdate = React.useMemo(() => [200], []);

  React.useEffect(() => {
    if (
      user.token !== undefined &&
      user.token !== null &&
      user.active === true &&
      Object.keys(user).length !== 0 &&
      !user.checked
    ) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [user]);

  React.useEffect(() => {
    (async () => {
      await TrackPlayer.setupPlayer({});
      await TrackPlayer.updateOptions({
        capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
      });
      await TrackPlayer.setRepeatMode(RepeatMode.Off);
    })();
  }, []);

  const [newVersion, setNewVersion] = React.useState(
    DeviceInfo.getVersion().replace("v", "")
  );

  React.useEffect(() => {
    fetch(getApi() + "/admin/version", { cache: "no-store" })
      .then((res: Response) => {
        return res.json();
      })
      .then((res: { v: string }) => {
        const currentVersion = DeviceInfo.getVersion().replace("v", "");
        const availableVersion = res.v;
        setNewVersion(availableVersion);
        if (currentVersion !== availableVersion) {
          bottomSheetRefUpdate.current?.snapToIndex(0);
        }
      })
      .catch((err) => {
        ToastAndroid.show(JSON.stringify(err), ToastAndroid.SHORT);
      });
  }, []);

  return (
    <NavigationContainer
      initialState={navigation}
      onStateChange={(state: any) => {
        if (state) {
          setNavigation(state);
        }
      }}
    >
      {user.token !== undefined &&
      user.token !== null &&
      user.active === true &&
      Object.keys(user).length !== 0 ? (
        <MainStackScreen />
      ) : (
        <EntryStackScreen />
      )}
      <StyledBottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        <StyledText style={{ fontSize: 20, fontWeight: "900" }}>
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
        <StyledButton
          style={{ width: 60, height: 60, marginTop: 30, marginLeft: "auto" }}
          title={<Ionicons name="checkmark" size={30} />}
          onPress={() => {
            UsersService.updateUser({ checked: true }).then((response) => {
              bottomSheetRef.current?.close();
              setUser(response.data);
            });
          }}
        />
      </StyledBottomSheet>
      <StyledBottomSheet
        ref={bottomSheetRefUpdate}
        snapPoints={snapPointsUpdate}
      >
        <StyledText style={{ fontSize: 24, fontWeight: "900" }}>
          Update Available
        </StyledText>

        <StyledText style={{ fontSize: 20, fontWeight: "900" }}>
          {`${DeviceInfo.getVersion().replace("v", "")} => ${newVersion}`}
        </StyledText>
      </StyledBottomSheet>
    </NavigationContainer>
  );
}

const MainStack = createStackNavigator();
function MainStackScreen() {
  const isDarkMode = useColorScheme() === "dark";
  const { t } = useTranslation();
  return (
    <MainStack.Navigator
      detachInactiveScreens={true}
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        },
        headerTitleStyle: {
          color: isDarkMode ? Colors.white : Colors.black,
        },
        headerLeft: () => (
          <Ionicons
            name="arrow-back"
            onPress={() => {
              navigation.goBack();
            }}
            size={30}
            color={isDarkMode ? Colors.white : Colors.black}
            style={{ paddingLeft: 10 }}
          />
        ),
      })}
    >
      <MainStack.Screen
        name="MainTab"
        component={MainTabScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="settings"
        component={SettingsScreen}
        options={{
          gestureEnabled: true,
          gestureResponseDistance: 80,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          title: t("common:nav_settings"),
        }}
      />
      <MainStack.Screen
        name="group_score"
        component={GroupScoreScreen}
        options={{
          gestureEnabled: true,
          gestureResponseDistance: 80,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          title: t("common:nav_group"),
        }}
      />
      <MainStack.Screen
        name="group_speed"
        component={GroupSpeedScreen}
        options={{
          gestureEnabled: true,
          gestureResponseDistance: 80,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          title: t("common:nav_group_speed"),
        }}
      />
      <MainStack.Screen
        name="group_freestyle"
        component={GroupFreestyleScreen}
        options={{
          gestureEnabled: true,
          gestureResponseDistance: 80,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          title: t("common:nav_freestyle"),
        }}
      />
      <MainStack.Screen
        name="group_create"
        component={GroupCreateScreen}
        options={{
          gestureEnabled: true,
          gestureResponseDistance: 80,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          title: t("common:nav_group_create"),
        }}
      />
      <MainStack.Screen
        name="group_settings_data"
        component={GroupSettingsDataScreen}
        options={{
          gestureEnabled: true,
          gestureResponseDistance: 80,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          title: t("common:nav_settings"),
        }}
      />
      <MainStack.Screen
        name="group_settings_users"
        component={GroupSettingsUsersScreen}
        options={{
          gestureEnabled: true,
          gestureResponseDistance: 80,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          title: t("common:nav_settings"),
        }}
      />
      <MainStack.Screen
        name="user_profile"
        component={UserProfileScreen}
        options={{
          gestureEnabled: true,
          gestureResponseDistance: 80,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          title: t("common:profile"),
        }}
      />
      <MainStack.Screen
        name="info"
        component={InfoScreen}
        options={{
          gestureEnabled: true,
          gestureResponseDistance: 80,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          title: t("common:nav_info"),
        }}
      />
      <MainStack.Screen
        name="freestyle"
        component={FreestyleScreen}
        options={{
          gestureEnabled: true,
          gestureResponseDistance: 80,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          title: t("common:nav_freestyle"),
        }}
      />
      <MainStack.Screen
        name="speed_data"
        component={SpeedDataOwnScreen}
        options={{
          gestureEnabled: true,
          gestureResponseDistance: 80,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          title: t("common:nav_speeddata"),
        }}
      />
      <MainStack.Screen
        name="counter_popover"
        component={CounterScreen}
        options={{
          gestureEnabled: true,
          gestureResponseDistance: 80,
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
          title: t("common:nav_counter"),
        }}
      />
    </MainStack.Navigator>
  );
}

const MainTab = createBottomTabNavigator();
function MainTabScreen() {
  const isDarkMode = useColorScheme() === "dark";
  const { t } = useTranslation();
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "groups") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "train") {
            iconName = focused ? "body" : "body-outline";
          } else if (route.name === "counter") {
            iconName = focused ? "radio-button-on" : "radio-button-on-outline";
          } else if (route.name === "player") {
            iconName = focused ? "musical-notes" : "musical-notes-outline";
          } else if (route.name === "profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.main,
        tabBarInactiveTintColor: isDarkMode ? Colors.grey : Colors.black,
        tabBarStyle: {
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? Colors.grey : Colors.black,
        },
        headerStyle: {
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        },
        headerTitleStyle: {
          color: isDarkMode ? Colors.white : Colors.black,
        },
        tabBarHideOnKeyboard: true,
      })}
      detachInactiveScreens={true}
    >
      <MainTab.Screen
        name="groups"
        component={GroupsScreen}
        options={{
          title: t("common:nav_groups"),
        }}
      />
      <MainTab.Screen
        name="train"
        component={TrainScreen}
        options={{
          title: t("common:nav_train"),
        }}
      />
      <MainTab.Screen
        name="counter"
        component={CounterScreen}
        options={{
          title: t("common:nav_counter"),
        }}
      />
      <MainTab.Screen
        name="player"
        component={PlayerScreen}
        options={{
          title: t("common:nav_player"),
        }}
      />
      <MainTab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: t("common:nav_profile"),
        }}
      />
    </MainTab.Navigator>
  );
}

const EntryStack = createStackNavigator();
function EntryStackScreen() {
  return (
    <EntryStack.Navigator screenOptions={{ headerShown: false }}>
      <EntryStack.Screen
        name="login"
        component={LoginScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <EntryStack.Screen
        name="register"
        component={RegisterScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </EntryStack.Navigator>
  );
}
