import BottomSheet, {
  BottomSheetProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { ReactNode, Ref } from "react";
import { useColorScheme } from "react-native";
import { Colors } from "../Constants";

const StyledBottomSheet = React.forwardRef(
  (props: BottomSheetProps, ref: Ref<BottomSheet>) => {
    const isDarkMode = useColorScheme() === "dark";

    return (
      <BottomSheet
        enablePanDownToClose={true}
        ref={ref}
        index={-1}
        backgroundStyle={{
          backgroundColor: isDarkMode ? Colors.blackSecond : Colors.white,
        }}
        handleIndicatorStyle={{
          backgroundColor: Colors.grey,
          height: 6,
          width: 60,
        }}
        animateOnMount={true}
        snapPoints={React.useMemo(
          () => [...(props.snapPoints as []), "100%"],
          [props.snapPoints]
        )}
      >
        <BottomSheetView style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
          {props.children as ReactNode}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

export default StyledBottomSheet;
