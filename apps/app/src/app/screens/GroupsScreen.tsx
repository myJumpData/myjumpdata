import * as React from "react";
import { FlatList } from "react-native";
import { StyledText } from "../components/StyledText";
import { StyledView } from "../components/StyledView";
import { Colors } from "../Constants";
import GroupsService from "../services/groups.service";

export default function GroupsScreen() {
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
  });

  const renderItem = ({ item }) => (
    <StyledView style={{ paddingTop: 10, paddingBottom: 10 }}>
      <StyledText>{item.name}</StyledText>
    </StyledView>
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
