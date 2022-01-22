import * as React from "react";
import { FlatList, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { StyledText } from "../components/StyledText";
import { StyledView } from "../components/StyledView";
import { Colors } from "../Constants";
import GroupsService from "../services/groups.service";

export default function GroupsScreen({ navigation }) {
  const user = useSelector((state: any) => state.user);
  const [groups, setGroups] = React.useState([]);

  const [refreshing, setRefreshing] = React.useState(false);

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
        navigation.navigate("Group", { id: item._id });
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <StyledText>{item.name}</StyledText>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {item.coaches.some((i: any) => i._id === user.id) && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Group Speed", { id: item._id });
              }}
            >
              <Ionicons
                name="timer-outline"
                style={{ color: Colors.white, padding: 5 }}
                size={25}
              />
            </TouchableOpacity>
          )}
          <Ionicons
            name="chevron-forward-outline"
            style={{ color: Colors.white, padding: 5 }}
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
    </StyledView>
  );
}