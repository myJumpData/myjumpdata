import * as React from "react";
import { FlatList, Image, Pressable, View } from "react-native";
import TrackPlayer, { Track } from "react-native-track-player";
import PlaceholderMusic from "../assets/music_placeholder.png";
import Player from "../components/Player";
import { StyledText } from "../components/StyledText";
import { StyledView } from "../components/StyledView";
import { borderRadius, Colors } from "../Constants";
import PlayerService from "../services/player.service";

export default function PlayerScreen() {
  const renderItem = ({ item }: { item: Track }) => (
    <Pressable
      style={{ paddingVertical: 10 }}
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
            margin: 7.5,
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
    <StyledView>
      <FlatList renderItem={renderItem} data={PlayerService.getLibrary()} />
      <Player />
    </StyledView>
  );
}
