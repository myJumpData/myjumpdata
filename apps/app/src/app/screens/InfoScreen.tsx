import * as React from "react";
import { Image, Linking, Platform, View } from "react-native";
import DeviceInfo from "react-native-device-info";
import { TouchableOpacity } from "react-native-gesture-handler";
import md5 from "react-native-md5";
import packageJson from "../../../../../package.json";
import {
  StyledHeading,
  StyledShyText,
  StyledText,
} from "../components/StyledText";
import { StyledView } from "../components/StyledView";
import { Colors } from "../Constants";

export default function InfoScreen() {
  return (
    <StyledView style={{ padding: 10 }}>
      <StyledHeading>Application</StyledHeading>
      <StyledShyText>{DeviceInfo.getApplicationName()}</StyledShyText>
      <StyledShyText>{DeviceInfo.getReadableVersion()}</StyledShyText>

      <StyledHeading>Authors</StyledHeading>
      <View style={{ flexDirection: "row" }}>
        <Image
          style={{
            width: 75,
            height: 75,
            borderRadius: 75,
            marginRight: 10,
            marginVertical: 10,
          }}
          source={{
            uri: `https://www.gravatar.com/avatar/${md5.hex_md5(
              packageJson.author.email
            )}?size=300&d=404`,
          }}
        />
        <View
          style={{
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <StyledShyText>{packageJson.author.name}</StyledShyText>
          <StyledShyText
            onPress={() => {
              Linking.openURL(`mailto:${packageJson.author.email}`);
            }}
          >
            {packageJson.author.email}
          </StyledShyText>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(packageJson.author.url);
            }}
          >
            <StyledShyText>{packageJson.author.url}</StyledShyText>
          </TouchableOpacity>
        </View>
      </View>

      <StyledHeading>Device</StyledHeading>
      <StyledText
        style={{ color: Colors.grey }}
      >{`${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()} - ${DeviceInfo.getBrand()} ${DeviceInfo.getModel()}`}</StyledText>
      <StyledText
        style={{ color: Colors.grey }}
      >{`React Native ${Platform.constants.reactNativeVersion.major}.${Platform.constants.reactNativeVersion.minor}.${Platform.constants.reactNativeVersion.patch}`}</StyledText>
      <StyledText
        style={{ color: Colors.grey }}
      >{`${DeviceInfo.getApplicationName()} ${DeviceInfo.getReadableVersion()}`}</StyledText>
    </StyledView>
  );
}
