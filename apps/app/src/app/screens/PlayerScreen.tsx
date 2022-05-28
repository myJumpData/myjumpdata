import * as React from "react";
import { FlatList, Image, Pressable, View } from "react-native";
import TrackPlayer, { Track } from "react-native-track-player";
import PlaceholderMusic from "../assets/music_placeholder.png";
import { StyledText } from "../components/StyledText";
import { StyledView } from "../components/StyledView";
import { borderRadius, Colors } from "../Constants";
import PlayerService from "../services/player.service";
import Wrapper from "../components/Wrapper";

export default function PlayerScreen() {
  const renderItem = ({ item }: { item: Track }) => (
    <Pressable
      onPress={async () => {
        await TrackPlayer.reset();
        await TrackPlayer.add(item);
        await TrackPlayer.play();
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: borderRadius / 1.5,
            marginRight: 7.5,
          }}
          source={PlaceholderMusic}
        />
        <View style={{ flexDirection: "column" }}>
          <StyledText style={{ fontSize: 18, fontWeight: "500" }}>
            {item.title}
          </StyledText>
          <StyledText style={{ fontSize: 14, color: Colors.grey }}>
            {item.artist}
          </StyledText>
        </View>
      </View>
    </Pressable>
  );

  return (
    <Wrapper as={StyledView}>
      <FlatList
        renderItem={renderItem}
        data={PlayerService.getLibrary()}
        ItemSeparatorComponent={() => <StyledView style={{ height: 16 }} />}
      />
    </Wrapper>
  );
}
