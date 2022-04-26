import * as React from "react";
import { ActivityIndicator, Image, View } from "react-native";
import Logo from "../assets/Logo.png";
import { Colors } from "../Constants";
import { StyledView } from "./StyledView";

export default function LoadingScreen() {
  return (
    <StyledView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Image
        source={Logo}
        style={{
          height: 200,
        }}
        resizeMode="contain"
      />
      <View style={{ position: "absolute", bottom: 40 }}>
        <ActivityIndicator size={75} color={Colors.main} />
      </View>
    </StyledView>
  );
}
