import { Picker } from "@react-native-picker/picker";
import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import Freestyle from "../components/Freestyle";
import { StyledView } from "../components/StyledView";
import { borderRadius, Colors } from "../Constants";
import { setFreestyle } from "../redux/freestyle.action";
import {
  getFreestyle,
  getFreestyleData,
  saveFreestyleData,
} from "../services/freestyle.service";
import GroupsService from "../services/groups.service";

type freestyle_folder_data = {
  id: string;
  key: string;
  back?: boolean;
  level?: string;
  group?: boolean;
  element?: boolean;
  compiled?: boolean;
};

export default function GroupFreestyleScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { id } = route.params;
  const isDarkMode = useColorScheme() === "dark";

  const freestyle = useSelector((state: any) => state.freestyle);

  const [freestyleDataOwn, setFreestyleDataOwn] = React.useState<any[]>([]);
  const [folderData, setFolderData] = React.useState<freestyle_folder_data[]>(
    []
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const [userSelect, setUserSelect] = React.useState([]);
  const [userSelected, setUserSelected] = React.useState("");

  React.useEffect(() => {
    GroupsService.getGroup(id as string).then((response: any) => {
      navigation.setOptions({ title: response.data.name });
      const tmp = response.data?.athletes.map((e) => {
        return {
          name:
            e.firstname && e.lastname
              ? `${e.firstname} ${e.lastname}`
              : e.username,
          value: e.id,
        };
      });
      setUserSelect(tmp);
      setUserSelected(tmp[0].value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  React.useEffect(() => {
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelected]);

  React.useEffect(() => {
    getCurrentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freestyle]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    GroupsService.getGroup(id as string).then((response: any) => {
      const tmp = response.data?.athletes.map((e) => {
        return {
          name:
            e.firstname && e.lastname
              ? `${e.firstname} ${e.lastname}`
              : e.username,
          value: e.id,
        };
      });
      setUserSelect(tmp);
      setRefreshing(false);
    });
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getUserData() {
    if (userSelected) {
      getFreestyleData(userSelected).then((response: any) => {
        setFreestyleDataOwn(response.data);
        setRefreshing(false);
      });
    }
  }

  function getCurrentData() {
    getFreestyle(freestyle).then((response: any) => {
      setFolderData(response.data);
      setRefreshing(false);
    });
  }

  function renderItem({ item }: { item: any }) {
    if (item.element) {
      const element = freestyleDataOwn?.find((e) => e.element === item.id);
      return (
        <Freestyle
          item={item}
          type="element"
          element={element}
          onSubmit={() => {
            setRefreshing(true);
            saveFreestyleData(
              userSelected,
              item.id as string,
              !element?.stateCoach
            ).then(() => {
              getUserData();
            });
          }}
        />
      );
    } else {
      return (
        <Freestyle
          item={item}
          type="navigate"
          onNavigate={() => {
            setRefreshing(true);
            setFreestyle(item.key);
          }}
        />
      );
    }
  }

  return (
    <StyledView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          margin: 10,
          borderBottomColor: Colors.grey,
          borderWidth: 2,
        }}
      >
        <Picker
          selectedValue={userSelected}
          onValueChange={(e) => setUserSelected(e)}
          style={{
            flex: 1,
            color: isDarkMode ? Colors.white : Colors.black,
            borderRadius: borderRadius,
          }}
          dropdownIconColor={isDarkMode ? Colors.white : Colors.black}
          mode="dropdown"
        >
          {userSelect.map((type: any) => (
            <Picker.Item
              key={type.value}
              label={type.name}
              value={type.value}
            />
          ))}
        </Picker>
      </View>
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          alignContent: "center",
          flexWrap: "wrap",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setFreestyle("");
          }}
          style={{
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={freestyle === "" ? "home" : "home"}
            size={20}
            color={Colors.grey}
          />
        </TouchableOpacity>
        {freestyle !== "" &&
          freestyle.split("_").map((e, index, array) => {
            const last = index + 1 === array.length;
            return (
              <React.Fragment key={index}>
                <View
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={Colors.grey}
                  />
                </View>
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setRefreshing(true);
                    setFreestyle(
                      freestyle
                        .split("_")
                        .splice(0, index + 1)
                        .join("_")
                    );
                  }}
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.grey,
                      fontWeight: last ? "900" : "400",
                      transform: [
                        { scale: last ? 1.2 : 1 },
                        { translateY: last ? -0.5 : 0 },
                        { translateX: last ? 2 : 0 },
                      ],
                    }}
                  >
                    {t(`freestyle:${e}`)}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
      </View>
      <FlatList
        renderItem={renderItem}
        data={folderData}
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
