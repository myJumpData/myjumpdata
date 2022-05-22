import TrackPlayer from "react-native-track-player";

module.exports = async function () {
  // @ts-ignore
  TrackPlayer.addEventListener("remote-play", () => TrackPlayer.play());

  // @ts-ignore
  TrackPlayer.addEventListener("remote-pause", () => TrackPlayer.pause());

  // @ts-ignore
  TrackPlayer.addEventListener("remote-stop", () => TrackPlayer.destroy());
};
