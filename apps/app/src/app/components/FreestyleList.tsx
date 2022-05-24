import { BackHandler, FlatList } from "react-native";
import { StyledView } from "./StyledView";
import { Colors } from "../Constants";
import * as React from "react";
import Freestyle from "./Freestyle";
import { setFreestyle } from "../redux/freestyle.action";
import Breadcrumb from "./Breadcrumb";
import { useSelector } from "react-redux";

export type FreestyleListType = {
  id: string;
  key: string;
  back?: boolean;
  level?: string;
  group?: boolean;
  element?: boolean;
  compiled?: boolean;
  club?: string;
  set?: boolean;
};

export default function FreestyleList({
  data,
  onSubmit,
  refreshing,
  setRefreshing,
  onRefresh,
  state,
  club,
}: {
  data: FreestyleListType[];
  onSubmit: ({
    // eslint-disable-next-line no-unused-vars
    itemId,
    // eslint-disable-next-line no-unused-vars
    state,
  }: {
    itemId: string;
    state: {
      stateUser: boolean | null | undefined;
      stateCoach: boolean | null | undefined;
    };
  }) => void;
  refreshing: boolean;
  // eslint-disable-next-line no-unused-vars
  setRefreshing: (state: boolean) => void;
  onRefresh: () => void;
  state: any;
  club: any;
}) {
  const freestyle = useSelector((state: any) => state.freestyle);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const back = data.find((item) => item.back === true);
        if (back) {
          setRefreshing(true);
          setFreestyle(back.key);
        }
        return true;
      }
    );

    return () => backHandler.remove();
  });

  function renderItem({ item }: { item: any }) {
    if (item.element) {
      const element = state?.find((e) => e.element === item.id);
      return (
        <Freestyle
          item={item}
          type="element"
          element={element}
          onSubmit={() => {
            onSubmit({ itemId: item.id, state: element });
          }}
        />
      );
    } else {
      if (!club && item.set && item.group) {
        return null;
      }
      if (club && item.group && item.set && item.club !== club._id) {
        return null;
      }
      return (
        <Freestyle
          item={item}
          type="navigate"
          onNavigate={() => {
            setRefreshing(true);
            setFreestyle(item.key);
          }}
        />
      );
    }
  }

  return (
    <>
      <Breadcrumb data={freestyle.split("_") || []} setState={setFreestyle} />
      <FlatList
        renderItem={renderItem}
        data={data}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ItemSeparatorComponent={() => (
          <StyledView
            style={{ borderBottomWidth: 2, borderColor: Colors.grey }}
          />
        )}
      />
    </>
  );
}
