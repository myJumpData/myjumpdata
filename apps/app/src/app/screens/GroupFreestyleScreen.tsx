import * as React from "react";
import { FlatList, View } from "react-native";
import { useSelector } from "react-redux";
import Breadcrumb from "../components/Breadcrumb";
import Freestyle from "../components/Freestyle";
import SelectInput from "../components/Input";
import Player from "../components/Player";
import { StyledView } from "../components/StyledView";
import { Colors } from "../Constants";
import { setFreestyle } from "../redux/freestyle.action";
import {
  getFreestyle,
  getFreestyleData,
  saveFreestyleData,
} from "../services/freestyle.service";
import GroupsService from "../services/groups.service";
import fullname from "../utils/fullname";

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
  const { id } = route.params;

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
          name: fullname(e),
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
          name: fullname(e),
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
        <SelectInput
          data={userSelect}
          state={userSelected}
          setState={setUserSelected}
        />
      </View>
      <Breadcrumb data={freestyle.split("_") || []} setState={setFreestyle} />
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
      <View style={{ padding: 10 }}>
        <Player />
      </View>
    </StyledView>
  );
}
