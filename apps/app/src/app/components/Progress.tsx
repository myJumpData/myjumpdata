import React from "react";
import { View } from "react-native";

export default function Progress({
  bars,
  styleContainer,
  styleProgress,
}: {
  bars: { color: string; progress: string; blop?: boolean }[];
  styleContainer?: any;
  styleProgress?: any;
}) {
  return (
    <View
      style={[
        {
          height: 4,
          width: "100%",
          backgroundColor: "hsl(0,0%,30%)",
          position: "relative",
        },
        styleContainer,
      ]}
    >
      {bars.map(
        (
          item: { color: string; progress: string; blop?: boolean },
          index: React.Key | null | undefined
        ) => (
          <View
            key={index}
            style={[
              {
                width: item.progress,
                backgroundColor: item.color,
                height: 4,
                position: "absolute",
              },
              styleProgress,
            ]}
          >
            {item.blop && (
              <View
                style={{
                  backgroundColor: item.color,
                  height: 16,
                  width: 16,
                  borderRadius: 8,
                  alignSelf: "flex-end",
                  marginTop: -6,
                  marginRight: -6,
                }}
              ></View>
            )}
          </View>
        )
      )}
    </View>
  );
}
