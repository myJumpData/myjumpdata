import TrackPlayer, { RepeatMode, State } from "react-native-track-player";
import store from "./store";

export async function playOrPause() {
  const state = await TrackPlayer.getState();
  if (state === State.Paused) {
    TrackPlayer.play();
    return;
  }
  if (state === State.Playing) {
    TrackPlayer.pause();
    return;
  }
  TrackPlayer.play();
}
export async function onPressNext() {
  const q = await TrackPlayer.getQueue();
  if (q.length > 1) {
    TrackPlayer.skipToNext();
  } else {
    TrackPlayer.seekTo(0);
  }
}
export async function onPressPrev() {
  const position = await TrackPlayer.getPosition();
  if (position > 1) {
    TrackPlayer.seekTo(0);
    return;
  }
  const q = await TrackPlayer.getQueue();
  if (q.length > 1) {
    TrackPlayer.skipToPrevious();
  }
}

export async function onPressStop() {
  TrackPlayer.reset();
}

export async function onPressRepeatMode() {
  const repeatMode = await TrackPlayer.getRepeatMode();
  if (repeatMode === RepeatMode.Off) {
    return setRepeatMode("track");
  }
  if (repeatMode === RepeatMode.Track) {
    return setRepeatMode("queue");
  }
  return setRepeatMode("off");
}

export async function setRepeatMode(mode: "off" | "track" | "queue") {
  if (mode === "off") {
    TrackPlayer.setRepeatMode(RepeatMode.Off);
  }
  if (mode === "track") {
    TrackPlayer.setRepeatMode(RepeatMode.Track);
  }
  if (mode === "queue") {
    const q = await TrackPlayer.getQueue();
    if (q.length > 1) {
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
    } else {
      mode = "off";
      TrackPlayer.setRepeatMode(RepeatMode.Off);
    }
  }
  return store.dispatch({ type: "setRepeatMode", payload: mode });
}
