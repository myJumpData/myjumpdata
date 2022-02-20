import React, { ReactNode } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { borderRadius } from "../Constants";

export default function BottomSheet({
  children,
  height = 300,
  draggable = true,
  visible = false,
  setVisible,
}: {
  children: ReactNode;
  height: number;
  draggable?: boolean;
  visible: boolean;
  setVisible: any;
}) {
  const isDarkMode = useColorScheme() === "dark";
  const [animatedHeight, setAnimatedHeight] = React.useState(
    new Animated.Value(0)
  );
  const pan = new Animated.ValueXY();
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      if (gestureState.dy > 0) {
        Animated.event([null, { dy: pan.y }], {
          useNativeDriver: false,
        })(e, gestureState);
      }
    },
    onPanResponderRelease: (e, gestureState) => {
      const gestureLimitArea = height / 3;
      const gestureDistance = gestureState.dy;
      if (gestureDistance > gestureLimitArea) {
        setVisible(false);
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  React.useEffect(() => {
    if (visible) {
      Animated.timing(animatedHeight, {
        toValue: height,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start(() => {
        pan.setValue({ x: 0, y: 0 });
        setAnimatedHeight(new Animated.Value(0));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal transparent visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "#25252599",
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "transparent",
          }}
          activeOpacity={1}
          onPress={() => {
            setVisible(false);
          }}
        />
        <Animated.View
          {...(draggable && panResponder.panHandlers)}
          style={[
            pan.getTranslateTransform(),
            {
              width: "100%",
              overflow: "hidden",
              height: animatedHeight,
              borderTopRightRadius: borderRadius,
              borderTopLeftRadius: borderRadius,
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            },
          ]}
        >
          {draggable && (
            <View
              style={{
                width: "100%",
                alignItems: "center",
                backgroundColor: "transparent",
              }}
            >
              <View
                style={{
                  width: 100,
                  height: 10,
                  borderRadius: 5,
                  margin: 10,
                  marginBottom: 0,
                  backgroundColor: "#A3A3A388",
                }}
              />
            </View>
          )}
          <View style={{ padding: 20 }}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}
