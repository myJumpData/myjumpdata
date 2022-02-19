import * as React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, TouchableOpacity, useColorScheme, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import StyledBottomSheet from "../components/StyledBottomSheet";
import { StyledText } from "../components/StyledText";
import { StyledView } from "../components/StyledView";
import { Colors } from "../Constants";
import GroupsService from "../services/groups.service";

export default function GroupsScreen({ navigation }) {
  const user = useSelector((state: any) => state.user);
  const { t } = useTranslation();
  const [groups, setGroups] = React.useState([]);
  const isDarkMode = useColorScheme() === "dark";

  const [refreshing, setRefreshing] = React.useState(false);
  const [current, setCurrent] = React.useState<any>();

  const bottomSheet = React.useRef<any>();

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
        bottomSheet.current.show();
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
      <StyledBottomSheet ref={bottomSheet} height={350}>
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

            <TouchableOpacity
              onPress={() => {
                console.log();
                bottomSheet.current.close();
                navigation.navigate("group_score", {
                  id: current._id,
                });
              }}
            >
              <StyledText style={{ paddingVertical: 10 }}>
                <Ionicons
                  name="filter-outline"
                  size={24}
                  color={isDarkMode ? Colors.white : Colors.black}
                />{" "}
                Scores
              </StyledText>
            </TouchableOpacity>
            {current.coaches.some((i: any) => i._id === user.id) && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    bottomSheet.current.close();
                    navigation.navigate("group_freestyle", {
                      id: current._id,
                    });
                  }}
                >
                  <StyledText style={{ paddingVertical: 10 }}>
                    <Ionicons
                      name="list-outline"
                      size={24}
                      color={isDarkMode ? Colors.white : Colors.black}
                    />
                    {" " + t("common:nav_freestyle")}
                  </StyledText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    bottomSheet.current.close();
                    navigation.navigate("group_speed", {
                      id: current._id,
                    });
                  }}
                >
                  <StyledText style={{ paddingVertical: 10 }}>
                    <Ionicons
                      name="timer-outline"
                      size={24}
                      color={isDarkMode ? Colors.white : Colors.black}
                    />
                    {" " + t("common:nav_speeddata")}
                  </StyledText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    bottomSheet.current.close();
                    navigation.navigate("group_settings_users", {
                      id: current._id,
                    });
                  }}
                >
                  <StyledText style={{ paddingVertical: 10 }}>
                    <Ionicons
                      name="people-outline"
                      size={24}
                      color={isDarkMode ? Colors.white : Colors.black}
                    />{" "}
                    Mitglieder bearbeiten
                  </StyledText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    bottomSheet.current.close();
                    navigation.navigate("group_settings_data", {
                      id: current._id,
                    });
                  }}
                >
                  <StyledText style={{ paddingVertical: 10 }}>
                    <Ionicons
                      name="create-outline"
                      size={24}
                      color={isDarkMode ? Colors.white : Colors.black}
                    />{" "}
                    Daten bearbeiten
                  </StyledText>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </StyledBottomSheet>
    </StyledView>
  );
}
