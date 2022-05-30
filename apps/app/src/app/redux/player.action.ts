import TrackPlayer, { RepeatMode, State } from "react-native-track-player";
import store from "./store";

export async function playOrPause() {
  const state = await TrackPlayer.getState();
  if (state === State.Paused) {
    await TrackPlayer.play();
    return;
  }
  if (state === State.Playing) {
    await TrackPlayer.pause();
    return;
  }
  await TrackPlayer.play();
}
export async function onPressNext() {
  const q = await TrackPlayer.getQueue();
  if (q.length > 1) {
    await TrackPlayer.skipToNext();
  } else {
    await TrackPlayer.seekTo(0);
  }
}
export async function onPressPrev() {
  const position = await TrackPlayer.getPosition();
  if (position > 1) {
    await TrackPlayer.seekTo(0);
    return;
  }
  const q = await TrackPlayer.getQueue();
  if (q.length > 1) {
    await TrackPlayer.skipToPrevious();
  }
}

export async function onPressStop() {
  await TrackPlayer.stop();
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
  let modeNew = mode;
  if (mode === "off") {
    await TrackPlayer.setRepeatMode(RepeatMode.Off);
  }
  if (mode === "track") {
    await TrackPlayer.setRepeatMode(RepeatMode.Track);
  }
  if (mode === "queue") {
    const q = await TrackPlayer.getQueue();
    if (q.length > 1) {
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);
    } else {
      modeNew = "off";
      await TrackPlayer.setRepeatMode(RepeatMode.Off);
    }
  }
  return store.dispatch({ type: "setRepeatMode", payload: modeNew });
}
