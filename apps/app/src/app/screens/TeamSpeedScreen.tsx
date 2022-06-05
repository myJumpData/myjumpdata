import BottomSheet from "@gorhom/bottom-sheet";
import * as React from "react";
import { useState } from "react";
import {
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import TrackPlayer from "react-native-track-player";
import { DateInput } from "../components/Input";
import SpeedDataInput from "../components/SpeedData";
import StyledBottomSheet from "../components/StyledBottomSheet";
import { StyledText } from "../components/StyledText";
import { borderRadius, Colors } from "../Constants";
import PlayerService from "../services/player.service";
import { musicData } from "../tracks";
import { useIsFocused } from "@react-navigation/native";
import StyledIcon from "../components/StyledIcon";
import Wrapper from "../components/Wrapper";
import { StyledView } from "../components/StyledView";
import ConfettiCannon from "react-native-confetti-cannon";
import TeamService from "../services/team.service";
import api from "../services/api";

export default function TeamSpeedScreen({ route, navigation }) {
  const { id } = route.params;
  const isFocused = useIsFocused();

  const [date, setDate] = React.useState<Date>(new Date());

  const [refreshing, setRefreshing] = React.useState(false);

  const ResetBottomSheetRef = React.useRef<BottomSheet>(null);
  const ResetSnapPoints = React.useMemo(() => [400], []);

  const MusicBottomSheetRef = React.useRef<BottomSheet>(null);
  const MusicSnapPoints = React.useMemo(() => [500], []);

  const isDarkMode = useColorScheme() === "dark";
  const [modal, setModal] = useState<any>(null);
  const [music, setMusic] = useState<any>(null);
  const ConfettiRef = React.useRef<any>(null);
  const [scoreDataRecords, setScoreDataRecords] = React.useState<any>([]);

  React.useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getData = () => {
    TeamService.getTeam(id).then((response: any) => {
      navigation.setOptions({ title: response.data.name });
    });
    api.get("/scoredata/team/" + id).then((response: any) => {
      setScoreDataRecords(response.data);
    });
  };

  React.useEffect(() => {
    if (isFocused) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper
      outside={
        <>
          <Modal
            animationType="slide"
            transparent={true}
            visible={!!modal}
            onRequestClose={() => {
              setModal(null);
            }}
          >
            <Pressable
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.25,
                backgroundColor: isDarkMode ? Colors.black : Colors.grey,
              }}
              onPress={() => {
                setModal(null);
              }}
            ></Pressable>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                marginTop: 22,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <StyledView
                style={{
                  flex: 0,
                  padding: 10,
                  borderRadius: borderRadius,
                  borderWidth: 1,
                  borderColor: Colors.grey,
                  alignItems: "center",
                }}
              >
                {modal ? (
                  <>
                    <StyledText style={{ fontWeight: "bold", fontSize: 24 }}>
                      {modal.type}
                    </StyledText>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <StyledText style={{ fontWeight: "bold", fontSize: 24 }}>
                        {modal.old}
                      </StyledText>
                      <StyledIcon
                        name={
                          Number(modal.new) > Number(modal.old)
                            ? "Ionicons/arrow-forward-outline"
                            : "Ionicons/menu-outline"
                        }
                        size={24}
                      />
                      <StyledText style={{ fontWeight: "bold", fontSize: 24 }}>
                        {modal.new}
                      </StyledText>
                    </View>
                  </>
                ) : null}
              </StyledView>
            </View>
          </Modal>
          <ConfettiCannon
            ref={ConfettiRef}
            autoStart={false}
            count={200}
            origin={{ x: -10, y: 0 }}
            fadeOut={true}
          />
          <StyledBottomSheet
            ref={ResetBottomSheetRef}
            snapPoints={ResetSnapPoints}
          >
            {/*currentUser ? (
              <>
                <StyledText
                  style={{ fontWeight: "900", fontSize: 24, marginBottom: 8 }}
                >
                  {t("scoredata_reset_title")}
                </StyledText>
                <StyledText
                  style={{ fontWeight: "900", fontSize: 24, marginBottom: 8 }}
                >
                  {teamName}
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
                    ScoreDataService.resetScoreData(
                      currentUser._id,
                      scoredatatype,
                      nativeEvent.text
                    ).then(() => {
                      ResetBottomSheetRef.current?.close();
                      getScoreDataHigh(id, scoredatatype);
                    });
                    target.clear();
                  }}
                />
              </>
            ) : null*/}
          </StyledBottomSheet>
          <StyledBottomSheet
            ref={MusicBottomSheetRef}
            snapPoints={MusicSnapPoints}
          >
            <StyledText
              style={{ fontWeight: "900", fontSize: 24, marginBottom: 8 }}
            >
              {scoreDataRecords.find((e: any) => e.value === music)?.type?.name}
            </StyledText>
            <View>
              {music
                ? PlayerService.getTracks(musicData[music].tracks).map(
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
                          <StyledText
                            style={{ fontSize: 18, fontWeight: "500" }}
                          >
                            {trackData.title}
                          </StyledText>
                          <StyledText
                            style={{ fontSize: 14, color: Colors.grey }}
                          >
                            {trackData.artist}
                          </StyledText>
                        </Pressable>
                      );
                    }
                  )
                : null}
            </View>
          </StyledBottomSheet>
        </>
      }
    >
      <DateInput setDate={setDate} date={date} />

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {scoreDataRecords?.map((data: any) => {
          return (
            <SpeedDataInput
              key={data.type._id}
              name={data.type.name}
              score={data.score}
              music={
                musicData[data.type._id] &&
                musicData[data.type._id].tracks.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      setMusic(data.type._id);
                      MusicBottomSheetRef.current?.snapToIndex(0);
                    }}
                  >
                    <StyledIcon name="Ionicons/musical-notes" size={24} />
                  </TouchableOpacity>
                ) : null
              }
              onSubmit={({ nativeEvent, target }) => {
                if (Number(nativeEvent.text) >= Number(data.score)) {
                  setModal({
                    old: data.score,
                    type: data.type.name,
                    new: Number(nativeEvent.text),
                  });
                  ConfettiRef.current?.start();
                }
                api
                  .post("/scoredata/team/" + id, {
                    score: Number(nativeEvent.text),
                    type: data.type._id,
                    date,
                  })
                  .then(() => {
                    getData();
                    target.clear();
                  });
                target.clear();
              }}
              onReset={() => {
                /*setCurrentUser(users.find((t: any) => t.id === selectedUser));
                ResetBottomSheetRef.current?.snapToIndex(0);*/
              }}
              counter={
                <TouchableOpacity
                  style={{ marginHorizontal: 5 }}
                  onPress={() => {
                    /*navigation.navigate("counter_popover", {
                      from: {
                        group: true,
                        type: data.type.name,
                        type_id: data.type._id,
                        name: teamName,
                        user_id: user.id,
                        high: highdata?.score || "0",
                      },
                    });*/
                  }}
                >
                  <StyledIcon name="Ionicons/radio-button-on" size={24} />
                </TouchableOpacity>
              }
            />
          );
        })}
      </ScrollView>
    </Wrapper>
  );
}
