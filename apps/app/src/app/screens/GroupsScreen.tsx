import BottomSheet from "@gorhom/bottom-sheet";
import { useIsFocused } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, TouchableOpacity, useColorScheme, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { BottomSheetNavList } from "../components/BottomSheetNav";
import Player from "../components/Player";
import StyledBottomSheet from "../components/StyledBottomSheet";
import { StyledText } from "../components/StyledText";
import { StyledView } from "../components/StyledView";
import { Colors } from "../Constants";
import GroupsService from "../services/groups.service";

export default function GroupsScreen({ navigation }) {
  const isFocused = useIsFocused();
  const user = useSelector((state: any) => state.user);
  const { t } = useTranslation();
  const [groups, setGroups] = React.useState([]);
  const isDarkMode = useColorScheme() === "dark";

  const [refreshing, setRefreshing] = React.useState(false);
  const [current, setCurrent] = React.useState<any>();

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => {
    return current.coaches.some((i: any) => i._id === user.id) ? [350] : [150];
  }, [current.coaches, user.id]);

  function getGroups() {
    GroupsService.getGroups().then((response: any) => {
      setGroups(response.data);
      setRefreshing(false);
    });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getGroups();
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      getGroups();
    }
  }, [isFocused]);

  React.useEffect(() => {
    getGroups();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        paddingTop: 20,
        paddingBottom: 20,
      }}
      onPress={() => {
        setCurrent(item);
        bottomSheetRef.current?.snapToIndex(0);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <StyledText style={{ fontSize: 24, fontWeight: "900" }}>
          {item.name}
        </StyledText>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="ellipsis-vertical"
            style={{
              color: isDarkMode ? Colors.white : Colors.black,
              padding: 5,
            }}
            size={25}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <StyledView style={{ padding: 10 }}>
      <FlatList
        renderItem={renderItem}
        data={groups}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ItemSeparatorComponent={() => (
          <StyledView
            style={{ borderBottomWidth: 2, borderColor: Colors.grey }}
          />
        )}
      />
      <StyledBottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        {current && (
          <>
            <StyledText
              style={{ fontWeight: "900", fontSize: 24, marginBottom: 15 }}
            >
              <Ionicons
                name="people"
                size={24}
                color={isDarkMode ? Colors.white : Colors.black}
              />
              {" " + current.name}
            </StyledText>

            <BottomSheetNavList
              bsRef={bottomSheetRef}
              data={[
                {
                  text: "Scores",
                  icon: "filter-outline",
                  onPress: () => {
                    navigation.navigate("group_score", {
                      id: current._id,
                    });
                  },
                },
                ...(current.coaches.some((i: any) => i._id === user.id)
                  ? [
                      {
                        text: t("common:nav_freestyle"),
                        icon: "list-outline",
                        onPress: () => {
                          navigation.navigate("group_freestyle", {
                            id: current._id,
                          });
                        },
                      },
                      {
                        text: t("common:nav_speeddata"),
                        icon: "timer-outline",
                        onPress: () => {
                          navigation.navigate("group_speed", {
                            id: current._id,
                          });
                        },
                      },
                      {
                        text: "Mitglieder bearbeiten",
                        icon: "people-outline",
                        onPress: () => {
                          navigation.navigate("group_settings_users", {
                            id: current._id,
                          });
                        },
                      },
                      {
                        text: "Daten bearbeiten",
                        icon: "create-outline",
                        onPress: () => {
                          navigation.navigate("group_settings_data", {
                            id: current._id,
                          });
                        },
                      },
                    ]
                  : []),
              ]}
            />
          </>
        )}
      </StyledBottomSheet>
      <Player />
    </StyledView>
  );
}
