import * as React from "react";
import { useSelector } from "react-redux";
import FreestyleList, { FreestyleListType } from "../components/FreestyleList";
import { StyledView } from "../components/StyledView";
import Wrapper from "../components/Wrapper";
import {
  getFreestyle,
  getUserFreestyle,
  saveFreestyleDataOwn,
} from "../services/freestyle.service";
import GroupsService from "../services/groups.service";

export default function FreestyleScreen() {
  const freestyle = useSelector((state: any) => state.freestyle);
  const user = useSelector((state: any) => state.user);

  const [freestyleDataOwn, setFreestyleDataOwn] = React.useState<any[]>([]);
  const [folderData, setFolderData] = React.useState<FreestyleListType[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [club, setClub] = React.useState<any>();

  React.useEffect(() => {
    GroupsService.getClub().then((response) => {
      setClub(response.data);
    });
  }, []);

  React.useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freestyle]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getFreestyle(freestyle).then((response: any) => {
      setFolderData(response.data);
      getUserFreestyle([user.id], [...response.data.map((e) => e.id)]).then(
        (response: any) => {
          setFreestyleDataOwn(response.data);
          setRefreshing(false);
        }
      );
    });
  }, [freestyle, user]);

  return (
    <Wrapper as={StyledView}>
      <FreestyleList
        data={folderData}
        onSubmit={function ({ itemId, state }) {
          saveFreestyleDataOwn(itemId, !state?.stateUser).then(() => {
            onRefresh();
          });
        }}
        refreshing={refreshing}
        setRefreshing={setRefreshing}
        onRefresh={onRefresh}
        state={freestyleDataOwn}
        club={club}
      />
    </Wrapper>
  );
}
