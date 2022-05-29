import BottomSheet from "@gorhom/bottom-sheet";
import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
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
import { Colors } from "../Constants";
import { setScoredatatype } from "../redux/scoredatatype.action";
import GroupsService from "../services/groups.service";
import PlayerService from "../services/player.service";
import ScoreDataService from "../services/scoredata.service";
import { musicData } from "../tracks";
import fullname from "../utils/fullname";
import { useIsFocused } from "@react-navigation/native";
import StyledIcon from "../components/StyledIcon";
import Wrapper from "../components/Wrapper";

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
