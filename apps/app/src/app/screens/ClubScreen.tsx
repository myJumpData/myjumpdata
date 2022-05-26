import React, { useEffect, useState } from "react";
import { Image, RefreshControl, View } from "react-native";
import Player from "../components/Player";
import { StyledShyText, StyledText } from "../components/StyledText";
import { StyledScrollView } from "../components/StyledView";
import GroupsService from "../services/groups.service";
import { useTranslation } from "react-i18next";
import { capitalize } from "../utils/capitalize";
import fullname from "../utils/fullname";

export default function ClubScreen({ route }) {
  const { id } = route.params;

  const { t } = useTranslation();

  const [refreshing, setRefreshing] = React.useState(false);
  const [club, setClub] = useState<any>();

  function getGroups() {
    GroupsService.getClub().then((response) => {
      setClub(response.data);
      setRefreshing(false);
    });
  }

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getGroups();
  }, []);

  function UserCard({ user }) {
    return (
      <View style={{ flexDirection: "row", paddingVertical: 10 }}>
        <View>
          <Image
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginRight: 10,
            }}
            source={{
              uri:
                user?.picture !== "" && user?.picture
                  ? user.picture
                  : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
            }}
          />
        </View>
        <View style={{ justifyContent: "center" }}>
          <StyledText>{capitalize(fullname(user))}</StyledText>
          <StyledShyText>{user.username}</StyledShyText>
        </View>
      </View>
    );
  }

  return (
    <StyledScrollView
      style={{ padding: 10 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {club ? (
        <>
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                width: 150,
                height: 150,
                marginRight: 10,
                padding: 10,
                marginVertical: 20,
              }}
              source={{ uri: club.logo }}
            />
            <StyledText style={{ fontWeight: "bold", fontSize: 24 }}>
              {club.name}
            </StyledText>
            <StyledShyText style={{ fontSize: 20 }}>
              {[club.country, club.state, club.city].join(" | ")}
            </StyledShyText>
          </View>
          <StyledText
            style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}
          >
            {t("common:coaches")}
          </StyledText>
          <View style={{ paddingBottom: 20 }}>
            {club.coaches.map((coach) => (
              <UserCard key={coach._id} user={coach} />
            ))}
          </View>
        </>
      ) : null}
      <Player />
    </StyledScrollView>
  );
}
