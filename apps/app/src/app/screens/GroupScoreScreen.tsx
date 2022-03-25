import { capitalize } from "@myjumpdata/utils";
import { Picker } from "@react-native-picker/picker";
import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import Player from "../components/Player";
import { StyledText } from "../components/StyledText";
import { StyledView } from "../components/StyledView";
import { Colors } from "../Constants";
import { setScoredatatype } from "../redux/scoredatatype.action";
import GroupsService from "../services/groups.service";
import ScoreDataService from "../services/scoredata.service";

export default function GroupScoreScreen({ route, navigation }) {
  const { id } = route.params;
  const { t } = useTranslation();
  const scoredatatype = useSelector((state: any) => state.scoredatatype);
  const isDarkMode = useColorScheme() === "dark";

  const [refreshing, setRefreshing] = React.useState(false);

  const [groupScores, setGroupScores] = React.useState([]);
  const [scoreDataTypes, setScoreDataTypes] = React.useState([]);
  const [typesOptions, setTypesOptions] = React.useState([]);

  React.useEffect(() => {
    getGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const options: any = scoreDataTypes?.map((type: any) => {
      return { value: type._id, name: type.name };
    });
    setTypesOptions(options);
  }, [scoreDataTypes]);

  function getGroup() {
    GroupsService.getGroup(id).then((response: any) => {
      navigation.setOptions({
        title: response.data?.name,
      });
      setRefreshing(false);
      ScoreDataService.getScoreDataTypes().then((response: any) => {
        setScoreDataTypes(response.data);
        if (scoredatatype === "") {
          setScoredatatype(response.data[0]._id);
          getScoreDataHigh(id, response.data[0]._id);
        }
      });
    });
  }

  React.useEffect(() => {
    if (scoredatatype !== "") {
      getScoreDataHigh(id, scoredatatype);
    }
  }, [scoredatatype, id]);

  function getScoreDataHigh(id: any, type: any) {
    ScoreDataService.getScoreDataHigh(id, type).then((response: any) => {
      setRefreshing(false);
      setGroupScores(response.data?.scores.sort((a, b) => a.score < b.score));
    });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getScoreDataHigh(id, scoredatatype);
    getGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({
    item,
    index,
  }: {
    item: {
      score: number;
      user: {
        _id: string;
        firstname: string;
        lastname: string;
        username: string;
        picture: undefined | null | boolean | string;
        active: boolean;
      };
    };
    index: number;
  }) => (
    <TouchableOpacity
      style={{
        paddingTop: 20,
        paddingBottom: 20,
      }}
      onPress={() => {
        navigation.navigate("user_profile", { username: item.user.username });
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
          <StyledText style={{ marginRight: 5, color: Colors.grey }}>
            {index + 1}.
          </StyledText>
          {item.user.picture !== undefined && item.user.picture !== null ? (
            <Image
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                marginRight: 10,
              }}
              source={{ uri: item.user.picture as string }}
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
                  {(
                    item.user.firstname[0] + item.user.lastname[0]
                  ).toUpperCase()}
                </Text>
              </View>
            </View>
          )}
          <StyledText>
            {`${capitalize(item.user.firstname)} ${capitalize(
              item.user.lastname
            )}`}
          </StyledText>
        </View>
        <StyledText>
          {t("common:high")}: {item.score}
        </StyledText>
      </View>
    </TouchableOpacity>
  );

  return (
    <StyledView style={{ padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          margin: 10,
        }}
      >
        <Picker
          selectedValue={scoredatatype}
          onValueChange={(e) => setScoredatatype(e)}
          style={{
            flex: 1,
            color: isDarkMode ? Colors.white : Colors.black,
          }}
          dropdownIconColor={isDarkMode ? Colors.white : Colors.black}
          mode="dropdown"
        >
          {typesOptions?.map((type: any) => (
            <Picker.Item
              key={type.value}
              label={type.name}
              value={type.value}
            />
          ))}
        </Picker>
      </View>
      <FlatList
        renderItem={renderItem}
        data={groupScores}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ItemSeparatorComponent={() => (
          <StyledView
            style={{ borderBottomWidth: 2, borderColor: Colors.grey }}
          />
        )}
      />
      <Player />
    </StyledView>
  );
}
