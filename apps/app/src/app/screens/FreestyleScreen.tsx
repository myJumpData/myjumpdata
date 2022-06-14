import i18next from "i18next";
import * as React from "react";
import { useSelector } from "react-redux";
import FreestyleList, { FreestyleListType } from "../components/FreestyleList";
import { StyledView } from "../components/StyledView";
import Wrapper from "../components/Wrapper";
import {
  getFreestyle,
  getFreestyleDataOwn,
  saveFreestyleDataOwn,
} from "../services/freestyle.service";
import GroupsService from "../services/groups.service";

export default function FreestyleScreen() {
  const freestyle = useSelector((state: any) => state.freestyle);

  const [freestyleDataOwn, setFreestyleDataOwn] = React.useState<any[]>([]);
  const [folderData, setFolderData] = React.useState<FreestyleListType[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [club, setClub] = React.useState<any>();
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    i18next.loadNamespaces("freestyle").then(() => {
      setLoaded(true);
    });
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    getCurrentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freestyle]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    (async () => {
      await getUserData();
    })();
  }, []);

  function getUserData() {
    GroupsService.getClub().then((response) => {
      setClub(response.data);
    });
    return getFreestyleDataOwn().then((response: any) => {
      setFreestyleDataOwn(response.data);
      setRefreshing(false);
      return Promise.resolve();
    });
  }

  function getCurrentData() {
    getFreestyle(freestyle).then((response: any) => {
      setFolderData(response.data);
      setRefreshing(false);
    });
  }

  return (
    <Wrapper as={StyledView}>
      {loaded ? (
        <FreestyleList
          data={folderData}
          onSubmit={function ({ itemId, state }) {
            return saveFreestyleDataOwn(itemId, !state?.stateUser).then(() => {
              return getUserData();
            });
          }}
          refreshing={refreshing}
          setRefreshing={setRefreshing}
          onRefresh={onRefresh}
          state={freestyleDataOwn}
          club={club}
        />
      ) : null}
    </Wrapper>
  );
}
