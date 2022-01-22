import * as React from "react";
import { FlatList, Image, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { StyledButton } from "../components/StyledButton";
import { StyledText } from "../components/StyledText";
import { StyledView } from "../components/StyledView";
import { Colors } from "../Constants";
import capitalize from "../helper/capitalzie";
import GroupsService from "../services/groups.service";

export default function GroupScreen({ route, navigation }) {
  const { id } = route.params;
  const user = useSelector((state: any) => state.user);

  const [groupCoaches, setGroupCoaches] = React.useState([]);
  const [groupAthletes, setGroupAthletes] = React.useState([]);

  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    getGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getGroup() {
    GroupsService.getGroup(id).then((response: any) => {
      navigation.setOptions({ title: response.data.name });
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
    <StyledView
      style={{
        paddingTop: 20,
        paddingBottom: 20,
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
    </StyledView>
  );

  return (
    <StyledView style={{ padding: 10 }}>
      {groupCoaches.some((i: any) => i.id === user.id) && (
        <StyledButton
          title="Speed"
          onPress={() => {
            navigation.navigate("Group Speed", { id });
          }}
        />
      )}

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
