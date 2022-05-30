import BottomSheet from "@gorhom/bottom-sheet";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Pressable,
  RefreshControl,
  useColorScheme,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import TrackPlayer from "react-native-track-player";
import { DateInput } from "../components/Input";
import SpeedDataInput from "../components/SpeedData";
import StyledBottomSheet from "../components/StyledBottomSheet";
import StyledIcon from "../components/StyledIcon";
import { StyledText } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import ConfettiCannon from "react-native-confetti-cannon";
import ScoreDataService from "../services/scoredata.service";
import { musicData } from "../tracks";
import { useIsFocused } from "@react-navigation/native";
import Wrapper from "../components/Wrapper";
import PlayerService from "../services/player.service";
import { borderRadius, Colors } from "../Constants";
import { StyledView } from "../components/StyledView";

export default function SpeedDataOwnScreen({ navigation }) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();

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

  const ConfettiRef = React.useRef<any>(null);

  const [modal, setModal] = useState<any>(null);

  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      setRefreshing(true);
      getData();
    }
  }, [isFocused]);

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

  const isDarkMode = useColorScheme() === "dark";

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
                      {modal.name}
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
          <StyledBottomSheet
            ref={MusicBottomSheetRef}
            snapPoints={MusicSnapPoints}
          >
            {musicSelect !== undefined ? (
              <>
                <StyledText
                  style={{ fontWeight: "900", fontSize: 24, marginBottom: 8 }}
                >
                  {musicSelect.name}
                </StyledText>
                <View>
                  {PlayerService.getTracks(
                    musicData[musicSelect._id].tracks
                  ).map((trackData) => {
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
                        <StyledText
                          style={{ fontSize: 14, color: Colors.grey }}
                        >
                          {trackData.artist}
                        </StyledText>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            ) : null}
          </StyledBottomSheet>
        </>
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <DateInput setDate={setDate} date={date} />

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
                if (Number(nativeEvent.text) >= Number(item.score)) {
                  setModal({
                    old: item.score,
                    new: Number(nativeEvent.text),
                    name: item.type.name,
                  });
                  ConfettiRef.current?.start();
                }
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
              musicData[item.type._id].tracks.length > 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    setMusicSelect(item.type);
                    MusicBottomSheetRef.current?.snapToIndex(0);
                  }}
                >
                  <StyledIcon name="Ionicons/musical-notes" size={24} />
                </TouchableOpacity>
              ) : null
            }
            counter={
              <TouchableOpacity
                style={{ marginHorizontal: 5 }}
                onPress={() => {
                  navigation.navigate("counter_popover", {
                    from: {
                      user: true,
                      type: item.type.name,
                      type_id: item.type._id,
                      high: item.score,
                    },
                  });
                }}
              >
                <StyledIcon name="Ionicons/radio-button-on" size={24} />
              </TouchableOpacity>
            }
          />
        );
      })}
    </Wrapper>
  );
}
