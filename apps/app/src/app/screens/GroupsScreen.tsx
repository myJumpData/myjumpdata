import BottomSheet from "@gorhom/bottom-sheet";
import { useIsFocused } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  useColorScheme,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { BottomSheetNavList } from "../components/BottomSheetNav";
import StyledBottomSheet from "../components/StyledBottomSheet";
import {
  StyledShyText,
  StyledShyTextStyle,
  StyledText,
} from "../components/StyledText";
import { StyledView } from "../components/StyledView";
import { Colors } from "../Constants";
import GroupsService from "../services/groups.service";
import StyledLink from "../components/StyledLink";
import Wrapper from "../components/Wrapper";
import StyledIcon from "../components/StyledIcon";
import { StyledButton } from "../components/StyledButton";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function GroupsScreen({ navigation }) {
  const isFocused = useIsFocused();
  const user = useSelector((state: any) => state.user);
  const { t } = useTranslation();
  const [groups, setGroups] = React.useState([]);
  const isDarkMode = useColorScheme() === "dark";

  const [refreshing, setRefreshing] = React.useState(false);
  const [current, setCurrent] = React.useState<any>();
  const [club, setClub] = useState<any>();

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => {
    return club &&
      [...club.coaches, ...club.admins].some((i: any) => i._id === user.id) &&
      current?.coaches.some((i: any) => i._id === user.id)
      ? [380]
      : [200];
  }, [club, current?.coaches, user.id]);
  const bottomSheetRefLeave = React.useRef<BottomSheet>(null);
  const snapPointsLeave = React.useMemo(() => {
    return [200];
  }, []);

  function getGroups() {
    GroupsService.getClub().then((response) => {
      setClub(response.data);
    });
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
    navigation.setOptions({
      headerRight: () => {
        if (
          club &&
          [...club.coaches, ...club.admins].some((i: any) => i._id === user.id)
        ) {
          return (
            <Ionicons
              name="add-outline"
              size={30}
              color={isDarkMode ? Colors.white : Colors.black}
              style={{ paddingRight: 10 }}
              onPress={() => navigation.navigate("group_create")}
            />
          );
        }
        return;
      },
    });
  }, [club, isDarkMode, navigation, user.id]);

  React.useEffect(() => {
    if (isFocused) {
      getGroups();
    }
  }, [isFocused]);

  React.useEffect(() => {
    getGroups();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        paddingVertical: 20,
      }}
      onPress={() => {
        setCurrent(item);
        bottomSheetRef.current?.snapToIndex(0);
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
    <Wrapper
      as={StyledView}
      outside={
        <>
          <StyledBottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
            {current ? (
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

                <BottomSheetNavList
                  bsRef={bottomSheetRef}
                  data={[
                    {
                      text: "Scores",
                      icon: "filter-outline",
                      onPress: () => {
                        navigation.navigate("group_score", {
                          id: current._id,
                        });
                      },
                    },
                    ...(current.coaches.some((i: any) => i._id === user.id)
                      ? [
                          {
                            text: t("common:nav_player"),
                            icon: "musical-notes-outline",
                            onPress: () => {
                              navigation.navigate("group_player", {
                                id: current._id,
                              });
                            },
                          },
                          {
                            text: t("common:nav_freestyle"),
                            icon: "list-outline",
                            onPress: () => {
                              navigation.navigate("group_freestyle", {
                                id: current._id,
                              });
                            },
                          },
                          {
                            text: t("common:nav_speeddata"),
                            icon: "timer-outline",
                            onPress: () => {
                              navigation.navigate("group_speed", {
                                id: current._id,
                              });
                            },
                          },
                          {
                            text: "Mitglieder bearbeiten",
                            icon: "people-outline",
                            onPress: () => {
                              navigation.navigate("group_settings_users", {
                                id: current._id,
                              });
                            },
                          },
                          {
                            text: "Daten bearbeiten",
                            icon: "create-outline",
                            onPress: () => {
                              navigation.navigate("group_settings_data", {
                                id: current._id,
                              });
                            },
                          },
                          {
                            text: "Verlassen",
                            icon: "log-out-outline",
                            onPress: () => {
                              GroupsService.leaveGroup(current._id).then(() => {
                                onRefresh();
                                bottomSheetRef.current?.close();
                              });
                            },
                          },
                        ]
                      : []),
                  ]}
                />
              </>
            ) : null}
          </StyledBottomSheet>
          <StyledBottomSheet
            ref={bottomSheetRefLeave}
            snapPoints={snapPointsLeave}
          >
            {club ? (
              <>
                <StyledText
                  style={{ fontWeight: "900", fontSize: 24, marginBottom: 15 }}
                >
                  Are you sure you want to leave this Club?
                </StyledText>
                <StyledButton
                  title={"Leave"}
                  onPress={() => {
                    GroupsService.leaveClub().then(() => {
                      bottomSheetRefLeave.current?.close();
                      getGroups();
                    });
                  }}
                />
              </>
            ) : null}
          </StyledBottomSheet>
        </>
      }
    >
      {club ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("club", { id: club._id });
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  marginRight: 10,
                }}
                source={{ uri: club.logo }}
              />
              <View>
                <StyledText>{club.name}</StyledText>
                <StyledShyText>
                  {(() => {
                    let tmp: string[] = [];
                    if (club.coaches?.some((e: any) => e._id === user.id)) {
                      tmp = [...tmp, "Coach"];
                    }
                    if (club.athletes?.some((e: any) => e._id === user.id)) {
                      tmp = [...tmp, "Athlete"];
                    }
                    if (club.admins?.some((e: any) => e._id === user.id)) {
                      tmp = [...tmp, "Admin"];
                    }
                    return tmp;
                  })().join(" | ")}
                </StyledShyText>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingLeft: 10 }}
            onPress={() => {
              bottomSheetRefLeave.current?.snapToIndex(0);
            }}
          >
            <StyledIcon size={30} name="Ionicons/ios-log-out-outline" />
          </TouchableOpacity>
        </View>
      ) : null}
      {club ? (
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
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <StyledShyText style={{ marginBottom: 5, fontSize: 20 }}>
            {t("club_notfound")}
          </StyledShyText>
          <StyledShyText style={{ marginBottom: 5, fontSize: 20 }}>
            {t("club_notfound_apply")}
          </StyledShyText>
          <StyledLink
            Style={StyledShyTextStyle}
            url="mailto:myjumpdata@gmail.com"
          >
            myjumpdata@gmail.com
          </StyledLink>
        </ScrollView>
      )}
    </Wrapper>
  );
}
