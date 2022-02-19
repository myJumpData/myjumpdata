import { capitalize } from "@myjumpdata/utils";
import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import BottomSheet from "react-native-gesture-bottom-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { StyledText } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledView } from "../components/StyledView";
import { borderRadius, Colors } from "../Constants";
import GroupsService from "../services/groups.service";
import UsersService from "../services/users.service";

export default function GroupSettingsScreen({ route, navigation }) {
  const { id } = route.params;
  const { t } = useTranslation();
  const isDarkMode = useColorScheme() === "dark";
  const user = useSelector((state: any) => state.user);

  const bottomSheet = React.useRef<any>();

  const [refreshing, setRefreshing] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");

  const [groupSearch, setGroupSearch] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [current, setCurrent] = React.useState<any>();

  const [groupCoaches, setGroupCoaches] = React.useState([]);
  const [groupAthletes, setGroupAthletes] = React.useState([]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (groupSearch !== "") {
        UsersService.searchUsers(groupSearch).then((response) => {
          setUsers(
            response.data.map((item) => {
              item.id = item._id;
              return item;
            })
          );
          setRefreshing(false);
        });
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [groupSearch]);

  React.useEffect(() => {
    setEditing(false);
    setRefreshing(true);
    GroupsService.getGroup(id as string).then((response: any) => {
      setGroupName(response.data.name);
      setGroupCoaches(response.data.coaches);
      setGroupAthletes(response.data.athletes);
      setRefreshing(false);
    });
  }, [id]);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (editing) {
          return (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{ paddingRight: 5 }}
                onPress={() => {
                  setEditing(false);
                  setRefreshing(true);
                  GroupsService.updateGroupName("", id).then((response) => {
                    setGroupName(response.data.name);
                    setRefreshing(false);
                  });
                }}
              >
                <Ionicons name="close-outline" size={40} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingRight: 10, marginTop: -1 }}
                onPress={() => {
                  setEditing(false);
                  setRefreshing(true);
                  GroupsService.updateGroupName(groupName, id).then(
                    (response) => {
                      setGroupName(response.data.name);
                      setRefreshing(false);
                    }
                  );
                }}
              >
                <Ionicons name="checkmark" size={35} color={Colors.main} />
              </TouchableOpacity>
            </View>
          );
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const onRefresh = React.useCallback(() => {
    setEditing(false);
    setRefreshing(true);
    GroupsService.getGroup(id as string).then((response: any) => {
      setGroupName(response.data.name);
      setGroupCoaches(response.data.coaches);
      setGroupAthletes(response.data.athletes);
      setRefreshing(false);
    });
  }, [id]);

  const renderItem = ({
    item,
  }: {
    item: {
      id: string;
      firstname: string;
      lastname: string;
      username: string;
      picture: undefined | null | boolean | string;
      active: boolean;
    };
  }) => {
    const isCoachGroup = groupCoaches.some((i: any) => i.id === item.id);
    const isAthleteGroup = groupAthletes.some((i: any) => i.id === item.id);
    return (
      <TouchableOpacity
        style={{
          paddingTop: 20,
          paddingBottom: 20,
        }}
        onPress={() => {
          navigation.navigate("user_profile", { username: item.username });
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {item.picture !== undefined &&
            item.picture !== null &&
            item.picture !== false &&
            item.picture !== "false" &&
            item.picture !== "none" ? (
              <Image
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  marginRight: 10,
                }}
                source={{ uri: item.picture as string }}
              />
            ) : (
              <View
                style={{
                  height: 40,
                  width: 40,
                  backgroundColor: Colors.main,
                  borderRadius: 20,
                  marginRight: 10,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: Colors.white }}>
                    {(item.firstname[0] + item.lastname[0]).toUpperCase()}
                  </Text>
                </View>
              </View>
            )}
            <StyledText>
              {`${capitalize(item.firstname)} ${capitalize(item.lastname)}`}
            </StyledText>
          </View>
          <View
            style={{
              width: 60,
              height: 30,
            }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                    borderWidth: 2,
                    borderColor: isCoachGroup
                      ? Colors.blue_500
                      : isAthleteGroup
                      ? Colors.orange_500
                      : "transparent",
                    width: 30,
                    height: 30,
                  }}
                >
                  <StyledText>
                    {isCoachGroup && "C"}
                    {isAthleteGroup && "A"}
                  </StyledText>
                </View>
              </View>
              <View>
                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-end",
                    justifyContent: "center",
                    width: 30,
                    height: 30,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setCurrent(item);
                      bottomSheet.current.show();
                    }}
                  >
                    <Ionicons
                      name="ellipsis-vertical"
                      size={24}
                      color={isDarkMode ? Colors.white : Colors.black}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <StyledView
      style={{ padding: 10 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StyledText style={{ fontWeight: "900" }}>
        {t("settings_data")}:
      </StyledText>
      <View style={{ marginVertical: 10, marginBottom: 30 }}>
        <StyledText>{t("common:group_name")}:</StyledText>
        <StyledTextInput
          onChangeText={(e) => {
            setEditing(true);
            setGroupName(e);
          }}
          value={groupName}
          autoCapitalize="none"
        />
      </View>
      <StyledText style={{ fontWeight: "900" }}>
        Mitglieder der Gruppe
      </StyledText>
      <View style={{ marginVertical: 10, marginBottom: 30 }}>
        <StyledText>{t("common:search")}:</StyledText>
        <StyledTextInput
          onChangeText={setGroupSearch}
          value={groupSearch}
          autoCapitalize="none"
        />
      </View>
      <FlatList
        renderItem={renderItem}
        data={[...users, ...groupCoaches, ...groupAthletes].filter(
          (item: any, index: number) =>
            [...users, ...groupCoaches, ...groupAthletes].findIndex(
              (value: any) => value.id === item.id
            ) === index
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ItemSeparatorComponent={() => (
          <StyledView
            style={{ borderBottomWidth: 2, borderColor: Colors.grey }}
          />
        )}
      />
      <BottomSheet
        hasDraggableIcon
        ref={bottomSheet}
        height={300}
        radius={borderRadius}
        sheetBackgroundColor={isDarkMode ? Colors.black : Colors.white}
      >
        {current && (
          <View style={{ padding: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {current.picture !== undefined &&
                current.picture !== null &&
                current.picture !== false &&
                current.picture !== "false" &&
                current.picture !== "none" ? (
                  <Image
                    style={{
                      height: 100,
                      width: 100,
                      borderRadius: 50,
                      marginRight: 10,
                    }}
                    source={{ uri: current.picture as string }}
                  />
                ) : (
                  <View
                    style={{
                      height: 100,
                      width: 100,
                      backgroundColor: Colors.main,
                      borderRadius: 50,
                      marginRight: 10,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.white,
                          fontSize: 40,
                          fontWeight: "900",
                        }}
                      >
                        {(
                          current.firstname[0] + current.lastname[0]
                        ).toUpperCase()}
                      </Text>
                    </View>
                  </View>
                )}
                <View>
                  <StyledText style={{ fontWeight: "700", fontSize: 24 }}>
                    {`${capitalize(current.firstname)} ${capitalize(
                      current.lastname
                    )}`}
                  </StyledText>
                  <StyledText>{current.username}</StyledText>
                </View>
              </View>
            </View>
            <View style={{ marginTop: 30 }}>
              {current?.roles?.some((e: any) => e.name === "coach") &&
                !groupCoaches.some((i: any) => i.id === current.id) && (
                  <TouchableOpacity
                    onPress={() => {
                      GroupsService.addCoachesToGroup(id as string, [
                        current.id,
                      ]).then(() => {
                        onRefresh();
                        bottomSheet.current.close();
                      });
                    }}
                  >
                    <StyledText>
                      <Ionicons
                        name="person-add"
                        size={24}
                        color={isDarkMode ? Colors.white : Colors.black}
                      />
                      {t("settings_group_user_action_add_coach")}
                    </StyledText>
                  </TouchableOpacity>
                )}
              {groupCoaches.some((i: any) => i.id === current.id) &&
                current.id !== user.id && (
                  <TouchableOpacity
                    onPress={() => {
                      GroupsService.removeCoachesFromGroup(id as string, [
                        current.id,
                      ]).then(() => {
                        onRefresh();
                        bottomSheet.current.close();
                      });
                    }}
                  >
                    <StyledText>
                      <Ionicons
                        name="person-remove"
                        size={24}
                        color={isDarkMode ? Colors.white : Colors.black}
                      />
                      {t("settings_group_user_action_remove_coach")}
                    </StyledText>
                  </TouchableOpacity>
                )}
              {!groupAthletes.some((i: any) => i.id === current.id) &&
                !groupCoaches.some((i: any) => i.id === current.id) && (
                  <TouchableOpacity
                    onPress={() => {
                      GroupsService.addUsersToGroup(id as string, [
                        current.id,
                      ]).then(() => {
                        onRefresh();
                        bottomSheet.current.close();
                      });
                    }}
                  >
                    <StyledText>
                      <Ionicons
                        name="person-add"
                        size={24}
                        color={isDarkMode ? Colors.white : Colors.black}
                      />
                      {t("settings_group_user_action_add_athlete")}
                    </StyledText>
                  </TouchableOpacity>
                )}
              {groupAthletes.some((i: any) => i.id === current.id) && (
                <TouchableOpacity
                  onPress={() => {
                    GroupsService.removeUsersFromGroup(id as string, [
                      current.id,
                    ]).then(() => {
                      onRefresh();
                      bottomSheet.current.close();
                    });
                  }}
                >
                  <StyledText>
                    <Ionicons
                      name="person-remove"
                      size={24}
                      color={isDarkMode ? Colors.white : Colors.black}
                    />
                    {t("settings_group_user_action_remove_athlete")}
                  </StyledText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </BottomSheet>
    </StyledView>
  );
}
