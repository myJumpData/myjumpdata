import BottomSheet from "@gorhom/bottom-sheet";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import SelectInput, { DateInput } from "../components/Input";
import SpeedDataInput from "../components/SpeedData";
import StyledBottomSheet from "../components/StyledBottomSheet";
import { StyledText } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { borderRadius, Colors } from "../Constants";
import { setScoredatatype } from "../redux/scoredatatype.action";
import GroupsService from "../services/groups.service";
import PlayerService from "../services/player.service";
import ScoreDataService from "../services/scoredata.service";
import { musicData } from "../tracks";
import fullname from "../utils/fullname";
import { useIsFocused } from "@react-navigation/native";
import StyledIcon from "../components/StyledIcon";
import Wrapper from "../components/Wrapper";
import { StyledView } from "../components/StyledView";
import ConfettiCannon from "react-native-confetti-cannon";
import { capitalize } from "../utils/capitalize";

export default function GroupSpeedScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { id } = route.params;
  const scoredatatype = useSelector((state: any) => state.scoredatatype);
  const isFocused = useIsFocused();

  const [groupScores, setGroupScores] = React.useState([]);
  const [groupHigh, setGroupHigh] = React.useState([]);
  const [scoreDataTypes, setScoreDataTypes] = React.useState<any>([]);
  const [typesOptions, setTypesOptions] = React.useState<any>([]);
  const [date, setDate] = React.useState<Date>(new Date());
  const [currentUser, setCurrentUser] = React.useState<any>({});

  const [refreshing, setRefreshing] = React.useState(false);

  const ResetBottomSheetRef = React.useRef<BottomSheet>(null);
  const ResetSnapPoints = React.useMemo(() => [400], []);

  const MusicBottomSheetRef = React.useRef<BottomSheet>(null);
  const MusicSnapPoints = React.useMemo(() => {
    return scoredatatype
      ? [musicData[scoredatatype].tracks.length * 60 + 120]
      : [500];
  }, [scoredatatype]);

  const isDarkMode = useColorScheme() === "dark";
  const [modal, setModal] = useState<any>(null);
  const ConfettiRef = React.useRef<any>(null);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (musicData[scoredatatype].tracks.length > 0) {
          return (
            <TouchableOpacity
              style={{ paddingRight: 5 }}
              onPress={() => {
                MusicBottomSheetRef.current?.snapToIndex(0);
              }}
            >
              <Ionicons name="musical-notes" size={35} color={Colors.white} />
            </TouchableOpacity>
          );
        }
        return null;
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scoredatatype]);

  React.useEffect(() => {
    GroupsService.getGroup(id).then((response: any) => {
      navigation.setOptions({ title: response.data.name });
    });
    ScoreDataService.getScoreDataTypes().then((response: any) => {
      setScoreDataTypes(response.data);
      if (scoredatatype === "") {
        setScoredatatype(response.data[0]._id);
        getScoreDataHigh(id, response.data[0]._id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  React.useEffect(() => {
    if (scoredatatype !== "") {
      getScoreDataHigh(id, scoredatatype);
    }
  }, [scoredatatype, id]);

  React.useEffect(() => {
    if (isFocused) {
      setRefreshing(true);
      getScoreDataHigh(id, scoredatatype);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  React.useEffect(() => {
    const options: any = scoreDataTypes.map((type: any) => {
      return { value: type._id, name: type.name };
    });
    setTypesOptions(options);
  }, [scoreDataTypes]);

  function getScoreDataHigh(id: any, type: any) {
    ScoreDataService.getScoreDataHigh(id, type).then((response: any) => {
      setRefreshing(false);
      setGroupScores(response.data?.scores);
      setGroupHigh(response.data?.high);
    });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getScoreDataHigh(id, scoredatatype);
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
                    <StyledText
                      style={{
                        fontWeight: "bold",
                        fontSize: 24,
                      }}
                    >
                      {modal.name}
                    </StyledText>
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
                        name="Ionicons/arrow-forward-outline"
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
            {currentUser ? (
              <>
                <StyledText
                  style={{ fontWeight: "900", fontSize: 24, marginBottom: 8 }}
                >
                  {t("scoredata_reset_title")}
                </StyledText>
                <StyledText
                  style={{ fontWeight: "900", fontSize: 24, marginBottom: 8 }}
                >
                  {fullname(currentUser)}
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
            ) : null}
          </StyledBottomSheet>
          <StyledBottomSheet
            ref={MusicBottomSheetRef}
            snapPoints={MusicSnapPoints}
          >
            <StyledText
              style={{ fontWeight: "900", fontSize: 24, marginBottom: 8 }}
            >
              {typesOptions.find((e: any) => e.value === scoredatatype)?.name}
            </StyledText>
            <View>
              {scoredatatype
                ? PlayerService.getTracks(musicData[scoredatatype].tracks).map(
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          margin: 10,
        }}
      >
        <SelectInput
          setState={setScoredatatype}
          state={scoredatatype}
          data={typesOptions}
        />
        <StyledText>
          {t("common:high")}: {groupHigh}
        </StyledText>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {groupScores?.map((score: any) => (
          <SpeedDataInput
            key={score.user._id}
            name={fullname(score.user)}
            score={score.score}
            onSubmit={({ nativeEvent, target }) => {
              ScoreDataService.saveScoreData(
                score.user._id,
                scoredatatype,
                nativeEvent.text,
                date
              ).then(() => {
                if (Number(nativeEvent.text) > score.score) {
                  setModal({
                    old: score.score,
                    type: typesOptions.find((t) => t.value === scoredatatype)
                      ?.name,
                    new: Number(nativeEvent.text),
                    name: capitalize(fullname(score.user)),
                  });
                  ConfettiRef.current?.start();
                }
                getScoreDataHigh(id, scoredatatype);
              });
              target.clear();
            }}
            onReset={() => {
              setCurrentUser(score.user);
              ResetBottomSheetRef.current?.snapToIndex(0);
            }}
            counter={
              <TouchableOpacity
                style={{ marginHorizontal: 5 }}
                onPress={() => {
                  navigation.navigate("counter_popover", {
                    from: {
                      group: true,
                      type: typesOptions.find((e) => e.value === scoredatatype)
                        .name,
                      type_id: scoredatatype,
                      name: fullname(score.user),
                      user_id: score.user._id,
                      high: score.score,
                    },
                  });
                }}
              >
                <StyledIcon name="Ionicons/radio-button-on" size={24} />
              </TouchableOpacity>
            }
          />
        ))}
      </ScrollView>
    </Wrapper>
  );
}
