import { capitalize } from "@myjumpdata/util";
import * as React from "react";
import { Image, RefreshControl, View } from "react-native";
import { useSelector } from "react-redux";
import { StyledText } from "../components/StyledText";
import { StyledScrollView, StyledView } from "../components/StyledView";
import { borderRadius, Colors } from "../Constants";
import UsersService from "../services/users.service";

export default function ProfileScreen() {
  const user = useSelector((state: any) => state.user);

  const [username, setUsername] = React.useState("");
  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [image, setImage] = React.useState(
    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  );
  const [userOverviewScoreData, setUserOverviewScoreData] = React.useState([]);

  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    UsersService.getUserSearch(user.username).then((response) => {
      setUsername(response.data?.username);
      setFirstname(response.data?.firstname);
      setLastname(response.data?.lastname);
      setUserOverviewScoreData(response.data?.highdata);
      if (response.data?.picture) {
        fetch(response.data.picture).then((r) => {
          if (r.status === 200) {
            setImage(response.data.picture);
          }
        });
      }
    });
  }, [user.username]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    UsersService.getUserSearch(user.username).then((response) => {
      setUsername(response.data?.username);
      setFirstname(response.data?.firstname);
      setLastname(response.data?.lastname);
      setUserOverviewScoreData(response.data?.highdata);
      if (response.data?.picture) {
        fetch(response.data.picture).then((r) => {
          if (r.status === 200) {
            setImage(response.data.picture);
          }
        });
      }
      setRefreshing(false);
    });
  }, [user.username]);

  return (
    <StyledScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StyledView
        style={{
          flexDirection: "row",
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <Image
          style={{ width: 150, height: 150, borderRadius: 75, marginRight: 10 }}
          source={{ uri: image }}
        />
        <StyledView
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <StyledText style={{ fontWeight: "600" }}>{username}</StyledText>
          <StyledText>
            {capitalize(firstname) + " " + capitalize(lastname)}
          </StyledText>
        </StyledView>
      </StyledView>
      <StyledView
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <StyledText style={{ fontWeight: "600" }}>Rekorde</StyledText>
        <StyledView>
          {userOverviewScoreData.map(
            (score: { type: string; score: number; scoreOwn: number }) => (
              <StyledView
                key={score.type}
                style={{
                  width: "100%",
                  borderWidth: 1,
                  borderColor: Colors.grey,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: borderRadius,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <StyledView>
                  <StyledText>{score.type}</StyledText>
                </StyledView>
                <View style={{ width: 100 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <StyledText>Gruppe</StyledText>
                    <StyledText>{score.score}</StyledText>
                  </View>
                  <StyledView
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <StyledText>Eigene</StyledText>
                    <StyledText>{score.scoreOwn}</StyledText>
                  </StyledView>
                </View>
              </StyledView>
            )
          )}
        </StyledView>
      </StyledView>
    </StyledScrollView>
  );
}
