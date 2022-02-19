import React, { ReactNode } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  background: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    width: "100%",
    height: 0,
    overflow: "hidden",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  draggableContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  draggableIcon: {
    width: 40,
    height: 6,
    borderRadius: 3,
    margin: 10,
    marginBottom: 0,
  },
});
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
      <View style={[styles.wrapper, { backgroundColor: "#25252599" }]}>
        <TouchableOpacity
          style={styles.background}
          activeOpacity={1}
          onPress={() => {
            setVisible(false);
          }}
        />
        <Animated.View
          {...(draggable && panResponder.panHandlers)}
          style={[
            pan.getTranslateTransform(),
            styles.container,
            {
              height: animatedHeight,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            },
          ]}
        >
          {draggable && (
            <View style={styles.draggableContainer}>
              <View
                style={[
                  styles.draggableIcon,
                  {
                    backgroundColor: "#A3A3A3",
                  },
                ]}
              />
            </View>
          )}
          <View style={{ padding: 20 }}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}
