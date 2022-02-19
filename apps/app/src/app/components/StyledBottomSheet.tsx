import React, { ReactNode } from "react";
import { useColorScheme, View } from "react-native";
import BottomSheet from "react-native-gesture-bottom-sheet";
import { borderRadius, Colors } from "../Constants";

const StyledBottomSheet = React.forwardRef(
  (
    props: { children: ReactNode; height: number; draggable?: boolean },
    ref
  ) => {
    const isDarkMode = useColorScheme() === "dark";

    return (
      <BottomSheet
        hasDraggableIcon={true}
        draggable={props.draggable === undefined ? true : props.draggable}
        ref={ref}
        height={props.height}
        radius={borderRadius}
        sheetBackgroundColor={isDarkMode ? Colors.black : Colors.white}
      >
        <View style={{ padding: 20 }}>{props.children}</View>
      </BottomSheet>
    );
  }
);
export default StyledBottomSheet;
