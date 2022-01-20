import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useColorScheme } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { Colors } from "./Constants";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";

export default function App() {
  const user = useSelector((state: any) => state.user);
  console.log(user);

  return (
    <NavigationContainer>
      {user.token !== undefined && user.token !== null ? (
        <MainStackScreen />
      ) : (
        <EntryStackScreen />
      )}
    </NavigationContainer>
  );
}

const MainStack = createStackNavigator();
function MainStackScreen() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="MainTab" component={MainTabScreen} />
    </MainStack.Navigator>
  );
}

const MainTab = createBottomTabNavigator();
function MainTabScreen() {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
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
    >
      <MainTab.Screen name="Profile" component={ProfileScreen} />
      <MainTab.Screen name="Settings" component={SettingsScreen} />
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
