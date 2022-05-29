import * as React from "react";
import { StyledView } from "../components/StyledView";
import api from "../services/api";
import getApi from "../utils/getApi";
import { capitalize } from "../utils/capitalize";
import fullname from "../utils/fullname";
import { FlatList, Image, Pressable, View } from "react-native";
import { StyledText } from "../components/StyledText";
import TrackPlayer from "react-native-track-player";
import { borderRadius, Colors } from "../Constants";
import PlaceholderMusic from "../assets/music_placeholder.png";
import Wrapper from "../components/Wrapper";

export default function GroupPlayerScreen({ route }) {
  const { id } = route.params;
  const [freestyleTracks, setFreestyleTracks] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const getFreestyleTracks = () => {
    api.get("/track/freestyle_group/" + id).then((res) => {
      setRefreshing(false);
      const data = res.data.users
        .map((user) => {
          if (user.freestyleTracks.length > 0) {
            return user.freestyleTracks.map((track) => {
              return {
                id: track.id,
                url: `${getApi()}/upload/${track.id}`,
                title: track.name,
                artist: capitalize(fullname(user)),
                artwork: user.picture,
              };
            });
          }
          return null;
        })
        .flat()
        .filter((n) => n);
      setFreestyleTracks(data);
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
