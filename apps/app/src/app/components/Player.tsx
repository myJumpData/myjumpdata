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
import { StyledText } from "./StyledText";
import { StyledView } from "./StyledView";

const events = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.PlaybackTrackChanged,
  Event.PlaybackQueueEnded,
];

export default function Player() {
  const progress = useProgress();
  const isDarkMode = useColorScheme() === "dark";

  const [playing, setPlaying] = React.useState<any>();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);

  const player = useSelector((state: any) => state.player);

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
            <View
              style={{
                flexDirection: "row-reverse",
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
            >
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
              <View style={styles.modalBottomActionProgressContainer}>
                <View
                  style={[
                    styles.modalBottomActionProgressBar,
                    {
                      width: percentage(progress.buffered, progress.duration),
                      backgroundColor: "hsl(0,0%,50%)",
                    },
                  ]}
                ></View>
                <View
                  style={[
                    styles.modalBottomActionProgressBar,
                    {
                      width: percentage(progress.position, progress.duration),
                      backgroundColor: Colors.white,
                    },
                  ]}
                >
                  <View style={styles.modalBottomActionProgressBuble}></View>
                </View>
              </View>
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
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Pressable style={{ padding: 5 }} onPress={onPressPrev}>
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
                  <Pressable style={{ padding: 5 }} onPress={onPressNext}>
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
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              backgroundColor: "hsl(38,0%,25%)",
              borderRadius: borderRadius,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                paddingTop: 5,
                paddingBottom: 1,
                paddingLeft: 5,
                paddingRight: 5,
              }}
            >
              <View
                style={{
                  position: "absolute",
                }}
              >
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: borderRadius / 1.5,
                    margin: 7.5,
                  }}
                  source={PlaceholderMusic}
                />
              </View>
              <View
                style={{
                  paddingHorizontal: 5,
                  marginLeft: 60,
                  width: Dimensions.get("window").width - 100,
                  marginRight: 100,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: "#fff",
                    fontWeight: "500",
                    marginTop: 12,
                    lineHeight: 18,
                  }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {playing?.title}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#fff",
                    opacity: 0.8,
                    marginBottom: 12,
                    lineHeight: 14,
                  }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {playing?.artist}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: 50,
                  position: "absolute",
                  right: 0,
                }}
              >
                <Pressable onPress={playOrPause} style={{ padding: 5 }}>
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
            </View>
            <View
              style={{
                height: 4,
                width: "100%",
                backgroundColor: "hsl(0,0%,30%)",
                position: "relative",
              }}
            >
              <View
                style={{
                  height: 4,
                  width: percentage(progress.buffered, progress.duration),
                  backgroundColor: "hsl(0,0%,50%)",
                  position: "absolute",
                }}
              ></View>
              <View
                style={{
                  height: 4,
                  width: percentage(progress.position, progress.duration),
                  backgroundColor: Colors.white,
                  position: "absolute",
                }}
              ></View>
            </View>
          </View>
        </Pressable>
      </>
    );
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, paddingBottom: 40 },
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
  modalBottomActionProgressContainer: {
    height: 4,
    width: "100%",
    backgroundColor: "hsl(0,0%,30%)",
    marginBottom: 20,
  },
  modalBottomActionProgressBar: {
    position: "absolute",
    height: 4,
  },
  modalBottomActionProgressBuble: {
    backgroundColor: Colors.white,
    height: 16,
    width: 16,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginTop: -6,
    marginRight: -6,
  },
  modalBottomActionControlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalBottomActionControlsButtonOuter: {
    padding: 5,
  },
  modalBottomActionControlsButtonCenter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
  },
});
