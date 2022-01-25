import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import * as React from "react";
import { LogBox, useColorScheme } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { Colors } from "./Constants";
import { setNavigation } from "./redux/navigation.action";
import GroupCreateScreen from "./screens/GroupCreateScreen";
import GroupScreen from "./screens/GroupScreen";
import GroupSpeedScreen from "./screens/GroupSpeedScreen";
import GroupsScreen from "./screens/GroupsScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SpeedDataOwnScreen from "./screens/SpeedDataOwnScreen";

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
  return (
    <MainStack.Navigator
      detachInactiveScreens={true}
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.grey,
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
            color={Colors.white}
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
        name="Einstellungen"
        component={SettingsScreen}
        options={{
          gestureEnabled: true,
          gestureResponseDistance: 80,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <MainStack.Screen
        name="Group"
        component={GroupScreen}
        options={{
          gestureEnabled: true,
          gestureResponseDistance: 80,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <MainStack.Screen
        name="Group Speed"
        component={GroupSpeedScreen}
        options={{
          gestureEnabled: true,
          gestureResponseDistance: 80,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <MainStack.Screen
        name="Group Create"
        component={GroupCreateScreen}
        options={{
          gestureEnabled: true,
          gestureResponseDistance: 80,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </MainStack.Navigator>
  );
}

const MainTab = createBottomTabNavigator();
function MainTabScreen({ navigation }) {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Gruppen") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Speed Werte") {
            iconName = focused ? "timer" : "timer-outline";
          } else if (route.name === "Profil") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.main,
        tabBarInactiveTintColor: Colors.grey,
        tabBarStyle: {
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.grey,
        },
        headerStyle: {
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.grey,
        },
        headerTitleStyle: {
          color: isDarkMode ? Colors.white : Colors.black,
        },
      })}
      detachInactiveScreens={true}
    >
      <MainTab.Screen
        name="Gruppen"
        component={GroupsScreen}
        options={{
          headerRight: () => (
            <Ionicons
              name="add-outline"
              size={30}
              color={Colors.white}
              style={{ paddingRight: 10 }}
              onPress={() => navigation.navigate("Group Create")}
            />
          ),
        }}
      />
      <MainTab.Screen name="Speed Werte" component={SpeedDataOwnScreen} />
      <MainTab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          headerRight: () => (
            <Ionicons
              name="settings-outline"
              size={30}
              color={Colors.white}
              style={{ paddingRight: 10 }}
              onPress={() => navigation.navigate("Einstellungen")}
            />
          ),
        }}
      />
    </MainTab.Navigator>
  );
}

const EntryStack = createStackNavigator();
function EntryStackScreen() {
  return (
    <EntryStack.Navigator screenOptions={{ headerShown: false }}>
      <EntryStack.Screen name="Login" component={LoginScreen} />
    </EntryStack.Navigator>
  );
}
