import * as React from "react";
import { AppRegistry, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";
import App from "./app/App";
import { Colors } from "./app/Constants";
import StoreProvider from "./app/redux/StoreProvider";

enableScreens();

function Main() {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
      }}
    >
      <StoreProvider>
        <App />
      </StoreProvider>
    </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent("main", () => Main);
