import BottomSheet from "@gorhom/bottom-sheet";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, RefreshControl, useColorScheme, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import TrackPlayer from "react-native-track-player";
import Ionicons from "react-native-vector-icons/Ionicons";
import { DateInput } from "../components/Input";
import Player from "../components/Player";
import SpeedDataInput from "../components/SpeedData";
import StyledBottomSheet from "../components/StyledBottomSheet";
import { StyledText } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledView } from "../components/StyledView";
import { Colors } from "../Constants";
import PlayerService from "../services/player.service";
import ScoreDataService from "../services/scoredata.service";
import { musicData } from "../tracks";

export default function SpeedDataOwnScreen() {
  const { t } = useTranslation();
  const isDarkMode = useColorScheme() === "dark";

  const [scoreData, setScoreData] = React.useState<any>([]);
  const [date, setDate] = React.useState<Date>(new Date());
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentType, setCurrentType] = React.useState<any>({});
  const [musicSelect, setMusicSelect] = React.useState<any>();

  const ResetBottomSheetRef = React.useRef<BottomSheet>(null);
  const ResetSnapPoints = React.useMemo(() => [400], []);

  const MusicBottomSheetRef = React.useRef<BottomSheet>(null);
  const MusicSnapPoints = React.useMemo(() => {
    return musicSelect
      ? [musicData[musicSelect._id].tracks.length * 60 + 120]
      : [500];
  }, [musicSelect]);

  React.useEffect(() => {
    getData();
  }, []);

  function getData() {
    ScoreDataService.getScoreDataOwn().then((response: any) => {
      const tmp = response.data.filter((x) => x !== null);
      setScoreData(tmp);
      setRefreshing(false);
    });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
  }, []);

  return (
    <StyledView
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <DateInput setDate={setDate} date={date} />

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {scoreData.map((item) => {
          return (
            <SpeedDataInput
              key={item.type._id}
              name={item.type.name}
              score={item.score}
              onSubmit={({ nativeEvent, target }) => {
                ScoreDataService.saveScoreDataOwn(
                  item.type._id,
                  nativeEvent.text,
                  date
                ).then(() => {
                  getData();
                });
                target.clear();
              }}
              onReset={() => {
                setCurrentType(item.type);
                ResetBottomSheetRef.current?.snapToIndex(0);
              }}
              music={
                musicData[item.type._id] &&
                musicData[item.type._id].tracks.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setMusicSelect(item.type);
                      MusicBottomSheetRef.current?.snapToIndex(0);
                    }}
                  >
                    <Ionicons
                      name="musical-notes"
                      size={24}
                      color={isDarkMode ? Colors.white : Colors.black}
                    />
                  </TouchableOpacity>
                )
              }
            />
          );
        })}
      </ScrollView>
      <StyledBottomSheet ref={ResetBottomSheetRef} snapPoints={ResetSnapPoints}>
        <StyledText
          style={{ fontWeight: "900", fontSize: 24, marginBottom: 8 }}
        >
          {t("scoredata_reset_title")}
        </StyledText>
        <StyledText
          style={{ fontWeight: "900", fontSize: 24, marginBottom: 8 }}
        >
          {currentType.name}
        </StyledText>
        <StyledText style={{ marginBottom: 8 }}>
          {t("scoredata_reset_text")}
        </StyledText>
        <StyledText style={{ fontWeight: "900", marginBottom: 16 }}>
          {t("scoredata_reset_warning")}
        </StyledText>
        <StyledTextInput
          style={{ marginBottom: 8 }}
          keyboardType="numeric"
          onSubmitEditing={({ nativeEvent, target }) => {
            ScoreDataService.resetScoreDataOwn(
              currentType._id,
              nativeEvent.text
            ).then(() => {
              ResetBottomSheetRef.current?.close();
              getData();
            });
            target.clear();
          }}
        />
      </StyledBottomSheet>
      <StyledBottomSheet ref={MusicBottomSheetRef} snapPoints={MusicSnapPoints}>
        {musicSelect !== undefined && (
          <>
            <StyledText
              style={{ fontWeight: "900", fontSize: 24, marginBottom: 8 }}
            >
              {musicSelect.name}
            </StyledText>
            <View>
              {PlayerService.getTracks(musicData[musicSelect._id].tracks).map(
                (trackData) => {
                  return (
                    <Pressable
                      style={{ paddingVertical: 10 }}
                      key={trackData.id}
                      onPress={async () => {
                        await TrackPlayer.reset();
                        await TrackPlayer.add(trackData);
                        await TrackPlayer.play();
                        MusicBottomSheetRef.current?.close();
                      }}
                    >
                      <StyledText style={{ fontSize: 18, fontWeight: "500" }}>
                        {trackData.title}
                      </StyledText>
                      <StyledText style={{ fontSize: 14, color: Colors.grey }}>
                        {trackData.artist}
                      </StyledText>
                    </Pressable>
                  );
                }
              )}
            </View>
          </>
        )}
      </StyledBottomSheet>
      <Player />
    </StyledView>
  );
}
