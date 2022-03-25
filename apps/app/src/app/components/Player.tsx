import Slider from "@react-native-community/slider";
import React from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import TrackPlayer, {
  Event,
  State,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import PlaceholderMusic from "../assets/music_placeholder.png";
import { borderRadius, Colors } from "../Constants";
import percentage from "../helper/percentage";
import {
  onPressNext,
  onPressPrev,
  onPressRepeatMode,
  onPressStop,
  playOrPause,
} from "../redux/player.action";
import Progress from "./Progress";
import { StyledText } from "./StyledText";
import { StyledView } from "./StyledView";

const events = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.PlaybackTrackChanged,
  Event.PlaybackQueueEnded,
];

export default function Player() {
  const progress = useProgress(250);
  const isDarkMode = useColorScheme() === "dark";

  const [playing, setPlaying] = React.useState<any>();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);

  const [sliderValue, setSliderValue] = React.useState(0);
  const [isSeeking, setIsSeeking] = React.useState(false);

  const player = useSelector((state: any) => state.player);

  React.useEffect(() => {
    if (!isSeeking && progress.position && progress.duration) {
      setSliderValue(progress.position / progress.duration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  React.useEffect(() => {
    TrackPlayer.getCurrentTrack().then((track) => {
      if (track !== null) {
        TrackPlayer.getTrack(track).then((trackData) => {
          setPlaying(trackData);
        });
      }
    });
    TrackPlayer.getQueue().then((q) => {
      if (q.length > 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    });

    TrackPlayer.getState().then((state) => {
      if (state === State.Paused) {
        setIsPlaying(false);
      }
      if (state === State.Playing) {
        setIsPlaying(true);
      }
    });
  }, []);

  useTrackPlayerEvents(events, async (event) => {
    if (event.type === Event.PlaybackError) {
      console.warn("An error occurred while playing the current track.");
    }
    if (event.type === Event.PlaybackState) {
      const q = await TrackPlayer.getQueue();
      if (q.length > 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      const state = await TrackPlayer.getState();
      if (state === State.Paused) {
        setIsPlaying(false);
      }
      if (state === State.Playing) {
        setIsPlaying(true);
      }
    }
    if (event.type === Event.PlaybackTrackChanged) {
      const track = await TrackPlayer.getCurrentTrack();
      const trackData = await TrackPlayer.getTrack(track);
      setPlaying(trackData);

      const q = await TrackPlayer.getQueue();
      if (q.length > 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
    if (event.type === Event.PlaybackQueueEnded) {
      TrackPlayer.seekTo(0);
      TrackPlayer.pause();
    }
  });

  const slidingStarted = () => {
    setIsSeeking(true);
  };

  const slidingCompleted = async (value) => {
    await TrackPlayer.seekTo(value * progress.duration);
    setSliderValue(value);
    setIsSeeking(false);
  };

  if (visible) {
    return (
      <>
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <StyledView style={styles.modalContainer}>
            <View style={styles.modalTopActionContainer}>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                }}
                style={styles.modalTopActionButton}
              >
                <Ionicons
                  name="chevron-down"
                  size={35}
                  color={isDarkMode ? Colors.white : Colors.black}
                />
              </Pressable>
            </View>
            <View style={styles.modalArtworkContainer}>
              <Image
                style={[
                  styles.modalArtwork,
                  {
                    width: Dimensions.get("window").width - 50,
                    height: Dimensions.get("window").width - 50,
                  },
                ]}
                source={PlaceholderMusic}
              />
            </View>
            <View style={styles.modalBottomActionContainer}>
              <View style={styles.modalBottomActionTextContainer}>
                <StyledText
                  style={styles.modalBottomActionTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {playing?.title}
                </StyledText>
                <StyledText
                  style={styles.modalBottomActionArtist}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {playing?.artist}
                </StyledText>
              </View>
              <Slider
                style={styles.modalProgressSlider}
                value={sliderValue}
                minimumTrackTintColor={isDarkMode ? Colors.white : Colors.black}
                maximumTrackTintColor={Colors.grey}
                onSlidingStart={slidingStarted}
                onSlidingComplete={slidingCompleted}
                thumbTintColor={isDarkMode ? Colors.white : Colors.black}
              />
              <View style={styles.modalBottomActionControlsContainer}>
                <Pressable
                  style={styles.modalBottomActionControlsButtonOuter}
                  onPress={() => {
                    setIsPlaying(false);
                    setModalVisible(false);
                    onPressStop();
                  }}
                >
                  <Ionicons
                    name="stop"
                    size={30}
                    color={isDarkMode ? Colors.white : Colors.black}
                  />
                </Pressable>
                <View
                  style={styles.modalBottomActionControlsButtonInnerContainer}
                >
                  <Pressable
                    style={styles.modalBottomActionControlsButtonInner}
                    onPress={onPressPrev}
                  >
                    <Ionicons
                      name="play-skip-back"
                      size={30}
                      color={isDarkMode ? Colors.white : Colors.black}
                    />
                  </Pressable>
                  <Pressable
                    onPress={playOrPause}
                    style={[
                      styles.modalBottomActionControlsButtonCenter,
                      {
                        backgroundColor: isDarkMode
                          ? Colors.white
                          : Colors.black,
                      },
                    ]}
                  >
                    {isPlaying ? (
                      <Ionicons
                        name="pause"
                        size={30}
                        color={isDarkMode ? Colors.black : Colors.white}
                        style={{ paddingLeft: 5 }}
                      />
                    ) : (
                      <Ionicons
                        name="play"
                        size={30}
                        color={isDarkMode ? Colors.black : Colors.white}
                        style={{ paddingLeft: 5 }}
                      />
                    )}
                  </Pressable>
                  <Pressable
                    style={styles.modalBottomActionControlsButtonInner}
                    onPress={onPressNext}
                  >
                    <Ionicons
                      name="play-skip-forward"
                      size={30}
                      color={isDarkMode ? Colors.white : Colors.black}
                    />
                  </Pressable>
                </View>
                <Pressable
                  style={styles.modalBottomActionControlsButtonOuter}
                  onPress={onPressRepeatMode}
                >
                  <Ionicons
                    name="repeat"
                    size={30}
                    color={
                      player.repeatMode === "off"
                        ? isDarkMode
                          ? Colors.white
                          : Colors.black
                        : Colors.main
                    }
                  />
                  {
                    <View
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {player.repeatMode === "track" ? (
                        <Text
                          style={{
                            color: Colors.main,
                            marginTop: 4,
                            fontSize: 12,
                          }}
                        >
                          1
                        </Text>
                      ) : (
                        player.repeatMode === "queue" && (
                          <View
                            style={{
                              backgroundColor: Colors.main,
                              height: 6,
                              width: 6,
                              borderRadius: 3,
                            }}
                          ></View>
                        )
                      )}
                    </View>
                  }
                </Pressable>
              </View>
            </View>
          </StyledView>
        </Modal>
        <Pressable
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <View style={styles.barContainer}>
            <View style={styles.barDataContainer}>
              <Image style={styles.barArtwork} source={PlaceholderMusic} />
              <View style={styles.barTextContainer}>
                <Text
                  style={styles.barTitle}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {playing?.title}
                </Text>
                <Text
                  style={styles.barArtist}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {playing?.artist}
                </Text>
              </View>
              <Pressable onPress={playOrPause} style={styles.barPlayPause}>
                {isPlaying ? (
                  <Ionicons
                    name="pause"
                    size={30}
                    color={isDarkMode ? Colors.white : Colors.black}
                  />
                ) : (
                  <Ionicons
                    name="play"
                    size={30}
                    color={isDarkMode ? Colors.white : Colors.black}
                  />
                )}
              </Pressable>
            </View>
            <Progress
              bars={[
                // Buffer
                {
                  progress: percentage(progress.buffered, progress.duration),
                  color: "hsl(0,0%,50%)",
                },
                // Progress
                {
                  progress: percentage(progress.position, progress.duration),
                  color: Colors.white,
                },
              ]}
            />
          </View>
        </Pressable>
      </>
    );
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}

const styles = StyleSheet.create({
  modalProgressSlider: { marginHorizontal: -15 },
  modalContainer: { flex: 1, paddingBottom: 40 },
  modalTopActionContainer: {
    flexDirection: "row-reverse",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalTopActionButton: { padding: 5 },
  modalArtworkContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  modalArtwork: {
    margin: 7.5,
    borderRadius: 10,
  },
  modalBottomActionContainer: {
    paddingHorizontal: 25,
  },
  modalBottomActionTextContainer: {
    paddingBottom: 20,
  },
  modalBottomActionTitle: {
    fontSize: 26,
    fontWeight: "500",
    marginTop: 12,
  },
  modalBottomActionArtist: {
    fontSize: 16,
    opacity: 0.8,
    marginTop: 10,
    marginBottom: 12,
  },
  modalBottomActionControlsContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalBottomActionControlsButtonOuter: {
    padding: 5,
  },
  modalBottomActionControlsButtonInnerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBottomActionControlsButtonInner: { padding: 5 },
  modalBottomActionControlsButtonCenter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
  },
  barContainer: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "hsl(38,0%,25%)",
    borderRadius: borderRadius,
    overflow: "hidden",
  },
  barDataContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingTop: 5,
    paddingBottom: 1,
    paddingLeft: 5,
    paddingRight: 5,
  },
  barArtwork: {
    width: 50,
    height: 50,
    borderRadius: borderRadius / 1.5,
    margin: 7.5,
  },
  barTextContainer: { flexGrow: 1 },
  barTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
    marginTop: 12,
    lineHeight: 18,
  },
  barArtist: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 12,
    lineHeight: 14,
  },
  barPlayPause: { padding: 10 },
});
