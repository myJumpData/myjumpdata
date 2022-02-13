import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { StyledText } from "../components/StyledText";
import { StyledView } from "../components/StyledView";
import { Colors } from "../Constants";
import { setFreestyle } from "../redux/freestyle.action";
import {
  getFreestyle,
  getFreestyleDataOwn,
  saveFreestyleDataOwn,
} from "../services/freestyle.service";

type freestyle_folder_data = {
  id: string;
  key: string;
  back?: boolean;
  level?: string;
  group?: boolean;
  element?: boolean;
  compiled?: boolean;
};

export default function FreestyleScreen() {
  const { t } = useTranslation();
  const isDarkMode = useColorScheme() === "dark";

  const freestyle = useSelector((state: any) => state.freestyle);

  const [freestyleDataOwn, setFreestyleDataOwn] = React.useState<any[]>([]);
  const [folderData, setFolderData] = React.useState<freestyle_folder_data[]>(
    []
  );
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    getUserData();
  }, []);

  React.useEffect(() => {
    getCurrentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freestyle]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getUserData();
  }, []);

  function getUserData() {
    getFreestyleDataOwn().then((response: any) => {
      setFreestyleDataOwn(response.data);
      setRefreshing(false);
    });
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
        <TouchableOpacity
          style={{
            padding: 10,

            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onPress={() => {
            setRefreshing(true);
            saveFreestyleDataOwn(item.id as string, !element?.stateUser).then(
              () => {
                getUserData();
              }
            );
          }}
        >
          <View
            style={{
              marginRight: 10,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome
              name={
                element?.stateCoach
                  ? "square"
                  : element?.stateUser
                  ? "check-square"
                  : "square-o"
              }
              size={element?.stateCoach ? 35 : element?.stateUser ? 35 : 40}
              color={Colors.main}
            />
          </View>
          <View style={{ flexGrow: 1 }}>
            {item.level && (
              <Text style={{ fontSize: 12, color: Colors.grey }}>
                Lvl. {item.level}
              </Text>
            )}
            <StyledText>
              {item.compiled
                ? item.key
                    .split("_")
                    .map((i) => t(`freestyle:${i}`))
                    .join(" ")
                : t(`freestyle:${item.key}`)}
            </StyledText>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={{
            padding: 10,

            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onPress={() => {
            setRefreshing(true);
            setFreestyle(item.key);
          }}
        >
          <View
            style={{
              marginRight: 10,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name={item.back ? "return-up-back" : "folder-outline"}
              size={item.back ? 30 : 40}
              color={Colors.main}
            />
          </View>
          <View style={{ flexGrow: 1 }}>
            <StyledText>
              {item.back
                ? t("common:back")
                : t(
                    `freestyle:${
                      item.key.split("_")[item.key.split("_").length - 1]
                    }`
                  )}
            </StyledText>
          </View>
        </TouchableOpacity>
      );
    }
  }

  return (
    <StyledView>
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
            color={isDarkMode ? Colors.grey : Colors.black}
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
                    color={isDarkMode ? Colors.grey : Colors.black}
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
                      color: isDarkMode ? Colors.grey : Colors.black,
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
