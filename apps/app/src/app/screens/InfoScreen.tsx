import * as React from "react";
import { Image, Linking, Platform, View } from "react-native";
import DeviceInfo from "react-native-device-info";
import md5 from "react-native-md5";
import packageJson from "../../../../../package.json";
import StyledLink from "../components/StyledLink";
import {
  StyledHeading,
  StyledShyText,
  StyledShyTextStyle,
  StyledText,
} from "../components/StyledText";
import { StyledView } from "../components/StyledView";
import { Colors } from "../Constants";

export default function InfoScreen() {
  const isHermes = () => {
    const g = global as any;
    return !!g.HermesInternal;
  };

  return (
    <StyledView style={{ padding: 10 }}>
      <StyledHeading>Application</StyledHeading>
      <StyledShyText>
        {packageJson.name} - {DeviceInfo.getReadableVersion()}
      </StyledShyText>
      <StyledShyText>{packageJson.description}</StyledShyText>
      <StyledLink Style={StyledShyTextStyle} url={packageJson.homepage}>
        {packageJson.homepage}
      </StyledLink>
      <StyledLink
        Style={StyledShyTextStyle}
        url="https://github.com/myJumpData/myjumpdata"
      >
        Github: myJumpData/myjumpdata
      </StyledLink>
      <StyledLink Style={StyledShyTextStyle} url={packageJson.bugs.url}>
        Bugs: {packageJson.bugs.url}
      </StyledLink>
      <StyledLink
        Style={StyledShyTextStyle}
        url={`mailto:${packageJson.bugs.email}`}
      >
        Bugs: {packageJson.bugs.email}
      </StyledLink>

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
              Linking.openURL(`mailto:${packageJson.author.email}`)
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                .then(() => {});
            }}
          >
            {packageJson.author.email}
          </StyledShyText>
          <StyledLink Style={StyledShyTextStyle} url={packageJson.author.url}>
            {packageJson.author.url}
          </StyledLink>
        </View>
      </View>

      <StyledHeading>Device</StyledHeading>
      <StyledText
        style={{ color: Colors.grey }}
      >{`${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()}`}</StyledText>
      <StyledText
        style={{ color: Colors.grey }}
      >{`${DeviceInfo.getBrand()} ${DeviceInfo.getModel()}`}</StyledText>
      <StyledText style={{ color: Colors.grey }}>{`React Native ${
        Platform.constants.reactNativeVersion.major
      }.${Platform.constants.reactNativeVersion.minor}.${
        Platform.constants.reactNativeVersion.patch
      }${isHermes() ? " | Hermes" : null}`}</StyledText>
    </StyledView>
  );
}
