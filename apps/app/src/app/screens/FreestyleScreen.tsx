import * as React from "react";
import { FlatList } from "react-native";
import { useSelector } from "react-redux";
import Breadcrumb from "../components/Breadcrumb";
import Freestyle from "../components/Freestyle";
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
        <Freestyle
          item={item}
          type="element"
          element={element}
          onSubmit={() => {
            setRefreshing(true);
            saveFreestyleDataOwn(item.id as string, !element?.stateUser).then(
              () => {
                getUserData();
              }
            );
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
    </StyledView>
  );
}
