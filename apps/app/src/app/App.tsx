import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { LogBox, useColorScheme } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { Colors } from "./Constants";
import { setNavigation } from "./redux/navigation.action";
import FreestyleScreen from "./screens/FreestyleScreen";
import GroupCreateScreen from "./screens/GroupCreateScreen";
import GroupFreestyleScreen from "./screens/GroupFreestyleScreen";
import GroupScreen from "./screens/GroupScreen";
import GroupSpeedScreen from "./screens/GroupSpeedScreen";
import GroupsScreen from "./screens/GroupsScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SpeedDataOwnScreen from "./screens/SpeedDataOwnScreen";
import UserProfileScreen from "./screens/UserProfileScreen";

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

export default function App() {
  const user = useSelector((state: any) => state.user);
  const navigation = useSelector((state: any) => state.navigation);

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
        name="group"
        component={GroupScreen}
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
        name="user_profile"
        component={UserProfileScreen}
        options={{
          gestureEnabled: true,
          gestureResponseDistance: 80,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          title: t("common:profile"),
        }}
      />
    </MainStack.Navigator>
  );
}

const MainTab = createBottomTabNavigator();
function MainTabScreen({ navigation }) {
  const isDarkMode = useColorScheme() === "dark";
  const { t } = useTranslation();
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "groups") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "freestyle") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "speed_data") {
            iconName = focused ? "timer" : "timer-outline";
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
      })}
      detachInactiveScreens={true}
    >
      <MainTab.Screen
        name="groups"
        component={GroupsScreen}
        options={{
          headerRight: () => (
            <Ionicons
              name="add-outline"
              size={30}
              color={isDarkMode ? Colors.white : Colors.black}
              style={{ paddingRight: 10 }}
              onPress={() => navigation.navigate("group_create")}
            />
          ),
          title: t("common:nav_groups"),
        }}
      />
      <MainTab.Screen
        name="freestyle"
        component={FreestyleScreen}
        options={{
          title: t("common:nav_freestyle"),
        }}
      />
      <MainTab.Screen
        name="speed_data"
        component={SpeedDataOwnScreen}
        options={{
          title: t("common:nav_speeddata"),
        }}
      />
      <MainTab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          headerRight: () => (
            <Ionicons
              name="settings-outline"
              size={30}
              color={isDarkMode ? Colors.white : Colors.black}
              style={{ paddingRight: 10 }}
              onPress={() => navigation.navigate("settings")}
            />
          ),
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
      <EntryStack.Screen name="login" component={LoginScreen} />
    </EntryStack.Navigator>
  );
}
