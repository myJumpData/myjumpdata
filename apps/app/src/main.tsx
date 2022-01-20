import * as React from "react";
import { AppRegistry } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";
import App from "./app/App";
import StoreProvider from "./app/redux/StoreProvider";

enableScreens();

function Main() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent("main", () => Main);
