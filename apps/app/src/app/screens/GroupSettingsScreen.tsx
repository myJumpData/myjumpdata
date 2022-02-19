import { capitalize } from "@myjumpdata/utils";
import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StyledText } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledView } from "../components/StyledView";
import { Colors } from "../Constants";
import GroupsService from "../services/groups.service";
import UsersService from "../services/users.service";

export default function GroupSettingsScreen({ route, navigation }) {
  const { id } = route.params;
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");

  const [groupSearch, setGroupSearch] = React.useState("");
  const [users, setUsers] = React.useState([]);

  const [groupCoaches, setGroupCoaches] = React.useState([]);
  const [groupAthletes, setGroupAthletes] = React.useState([]);

  React.useEffect(() => {
    setRefreshing(true);
    const timeoutId = setTimeout(() => {
      if (groupSearch !== "") {
        UsersService.searchUsers(groupSearch).then((response) => {
          setUsers(response.data);
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
            {item.picture !== undefined && item.picture !== null ? (
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
              width: 30,
              height: 30,
            }}
          >
            <View
              style={{
                borderWidth: 2,
                borderColor: isCoachGroup
                  ? Colors.blue_500
                  : isAthleteGroup
                  ? Colors.orange_500
                  : "transparent",
                borderRadius: 5,
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StyledText>
                {isCoachGroup && "C"}
                {isAthleteGroup && "A"}
              </StyledText>
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
        data={[...users, ...groupCoaches, ...groupAthletes]}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ItemSeparatorComponent={() => (
          <StyledView
            style={{ borderBottomWidth: 2, borderColor: Colors.grey }}
          />
        )}
      />
    </StyledView>
  );
}
