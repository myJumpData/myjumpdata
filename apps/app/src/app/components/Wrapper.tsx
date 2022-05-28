import { StyledScrollView, StyledView } from "./StyledView";
import { RefreshControlProps, View } from "react-native";
import React, { ReactNode } from "react";
import Player from "./Player";
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from "react-native-track-player";

const events = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.PlaybackTrackChanged,
  Event.PlaybackQueueEnded,
];

export default function Wrapper({
  children,
  refreshControl,
  outside,
  as = StyledScrollView,
}: {
  children?: ReactNode;
  outside?: ReactNode;
  refreshControl?:
    | React.ReactElement<
        RefreshControlProps,
        string | React.JSXElementConstructor<any>
      >
    | undefined;
  // eslint-disable-next-line no-unused-vars
  as?: any;
}) {
  const [visible, setVisible] = React.useState(false);

  const Component = as;

  React.useEffect(() => {
    TrackPlayer.getQueue().then((q) => {
      if (q.length > 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    });
  }, []);

  useTrackPlayerEvents(events, async (event) => {
    if (event.type === Event.PlaybackError) {
      // eslint-disable-next-line no-console
      console.warn("An error occurred while playing the current track.");
    }
    if (event.type === Event.PlaybackState) {
      const q = await TrackPlayer.getQueue();
      if (q.length > 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  });

  return (
    <StyledView style={{ flex: 1 }}>
      <Component refreshControl={refreshControl}>
        <View
          style={{
            padding: 16,
            paddingBottom: visible ? 100 : 10,
            flex: 1,
          }}
        >
          {children}
        </View>
      </Component>
      <View
        style={{
          padding: 10,
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <Player />
      </View>
      {outside}
    </StyledView>
  );
}
