import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyledButton } from "../components/StyledButton";
import { StyledText } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledView } from "../components/StyledView";
import GroupsService from "../services/groups.service";
import Wrapper from "../components/Wrapper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TeamService from "../services/team.service";
import { RefreshControl, useColorScheme } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Colors } from "../Constants";

export default function CreateScreen({ navigation }) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const [club, setClub] = useState<any>();
  const [refreshing, setRefreshing] = React.useState(false);
  const isDarkMode = useColorScheme() === "dark";

  function getGroups() {
    GroupsService.getClub().then((response) => {
      setClub(response.data);
      setRefreshing(false);
    });
  }

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getGroups();
  }, []);

  const Tab = createMaterialTopTabNavigator();

  function Group() {
    const [groupname, setGroupname] = React.useState<string>("");
    const { t } = useTranslation();

    function handleCreateGroup() {
      GroupsService.createGroup(groupname.trim(), club?._id).then(() => {
        setGroupname("");
        navigation.navigate("groups");
      });
    }
    return (
      <Wrapper
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <StyledView
          style={{
            paddingVertical: 10,
          }}
        >
          <StyledText>{t("common:group_name")}:</StyledText>
          <StyledTextInput
            onChangeText={setGroupname}
            value={groupname}
            autoFocus
          />
        </StyledView>
        <StyledView
          style={{
            paddingVertical: 10,
          }}
        >
          <StyledButton
            title={t("common:create_group")}
            onPress={handleCreateGroup}
          />
        </StyledView>
      </Wrapper>
    );
  }

  function Team() {
    const [teamName, setTeamName] = React.useState<string>("");
    const { t } = useTranslation();

    function handleCreateTeam() {
      TeamService.createTeam(teamName.trim(), club?._id).then(() => {
        setTeamName("");
        navigation.navigate("groups");
      });
    }
    return (
      <Wrapper
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <StyledView
          style={{
            paddingVertical: 10,
          }}
        >
          <StyledText>{t("common:team_name")}:</StyledText>
          <StyledTextInput
            onChangeText={setTeamName}
            value={teamName}
            autoFocus
          />
        </StyledView>
        <StyledView
          style={{
            paddingVertical: 10,
          }}
        >
          <StyledButton
            title={t("common:create_team")}
            onPress={handleCreateTeam}
          />
        </StyledView>
      </Wrapper>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.main,
        tabBarInactiveTintColor: isDarkMode ? Colors.grey : Colors.black,
        tabBarPressColor: Colors.grey,
        tabBarStyle: {
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        },
      }}
    >
      <Tab.Screen
        name="group_create"
        component={Group}
        options={{
          title: t("common:create_group"),
        }}
      />
      <Tab.Screen
        name="team_create"
        component={Team}
        options={{
          title: t("common:create_team"),
        }}
      />
    </Tab.Navigator>
  );
}
