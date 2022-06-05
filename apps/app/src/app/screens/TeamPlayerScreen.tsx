import * as React from "react";
import { StyledView } from "../components/StyledView";
import api from "../services/api";
import getApi from "../utils/getApi";
import { FlatList, Image, Pressable, View } from "react-native";
import { StyledText } from "../components/StyledText";
import TrackPlayer from "react-native-track-player";
import { borderRadius, Colors } from "../Constants";
import PlaceholderMusic from "../assets/music_placeholder.png";
import Wrapper from "../components/Wrapper";
import TeamService from "../services/team.service";

export default function TeamPlayerScreen({ route }) {
  const { id } = route.params;
  const [freestyleTracks, setFreestyleTracks] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const getFreestyleTracks = () => {
    TeamService.getTeam(id).then((response: any) => {
      api.get("/track/freestyle_team/" + id).then((res) => {
        setRefreshing(false);
        const data = res.data?.freestyleTracks.map((track) => {
          return {
            id: track.id,
            url: `${getApi()}/upload/${track.id}`,
            title: track.name,
            artist: response.data?.name,
          };
        });

        setFreestyleTracks(data);
      });
    });
  };

  React.useEffect(() => {
    getFreestyleTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({ item }: any) => {
    return (
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
            source={item?.artwork ? { uri: item.artwork } : PlaceholderMusic}
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
  };

  return (
    <Wrapper as={StyledView}>
      <FlatList
        renderItem={renderItem}
        data={freestyleTracks}
        keyExtractor={(item, index) => String(index)}
        refreshing={refreshing}
        onRefresh={getFreestyleTracks}
        ItemSeparatorComponent={() => <StyledView style={{ height: 16 }} />}
      />
    </Wrapper>
  );
}
