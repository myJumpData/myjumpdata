import { capitalize } from "@myjumpdata/utils";
import * as React from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { StyledText } from "../components/StyledText";
import { StyledView } from "../components/StyledView";
import { Colors } from "../Constants";
import GroupsService from "../services/groups.service";

export default function GroupScreen({ route, navigation }) {
  const { id } = route.params;
  const user = useSelector((state: any) => state.user);
  const isDarkMode = useColorScheme() === "dark";

  const [groupCoaches, setGroupCoaches] = React.useState([]);
  const [groupAthletes, setGroupAthletes] = React.useState([]);

  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    getGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getGroup() {
    GroupsService.getGroup(id).then((response: any) => {
      navigation.setOptions({
        title: response.data.name,
        headerRight: () => {
          if (response?.data?.coaches.some((i: any) => i.id === user.id)) {
            return (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{ paddingRight: 10 }}
                  onPress={() => navigation.navigate("group_freestyle", { id })}
                >
                  <Ionicons
                    name="list-outline"
                    size={30}
                    color={isDarkMode ? Colors.white : Colors.black}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ paddingRight: 10 }}
                  onPress={() => navigation.navigate("group_speed", { id })}
                >
                  <Ionicons
                    name="timer-outline"
                    size={30}
                    color={isDarkMode ? Colors.white : Colors.black}
                  />
                </TouchableOpacity>
              </View>
            );
          }
        },
      });
      setGroupCoaches(response?.data?.coaches);
      setGroupAthletes(response?.data?.athletes);
      setRefreshing(false);
    });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({
    item,
  }: {
    item: {
      id: string;
      firstname: string;
      lastname: string;
      username: string;
      picture: undefined | null | boolean | string;
    };
  }) => (
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
            {capitalize(item.firstname) + " " + capitalize(item.lastname)}
          </StyledText>
        </View>
        {groupCoaches.some((i: any) => i.id === item.id) && (
          <View
            style={{
              width: 30,
              height: 30,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#3b82f6",
              borderRadius: 6,
            }}
          >
            <StyledText>C</StyledText>
          </View>
        )}
        {groupAthletes.some((i: any) => i.id === item.id) && (
          <View
            style={{
              width: 30,
              height: 30,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#F97316",
              borderRadius: 6,
            }}
          >
            <StyledText>A</StyledText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <StyledView style={{ padding: 10 }}>
      <FlatList
        renderItem={renderItem}
        data={[...groupCoaches, ...groupAthletes]}
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
