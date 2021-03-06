import * as React from "react";
import { AppRegistry, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";
import TrackPlayer from "react-native-track-player";
import App from "./app/App";
import LoadingScreen from "./app/components/LoadingScreen";
import { Colors } from "./app/Constants";
import StoreProvider from "./app/redux/StoreProvider";
import "./i18n";

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
      <React.Suspense fallback={<LoadingScreen />}>
        <StoreProvider>
          <App />
        </StoreProvider>
      </React.Suspense>
    </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent("main", () => Main);
TrackPlayer.registerPlaybackService(() => require("./service"));
