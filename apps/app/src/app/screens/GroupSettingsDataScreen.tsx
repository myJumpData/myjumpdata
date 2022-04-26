import BottomSheet from "@gorhom/bottom-sheet";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import StyledBottomSheet from "../components/StyledBottomSheet";
import { StyledButton } from "../components/StyledButton";
import { StyledText } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledScrollView } from "../components/StyledView";
import { Colors } from "../Constants";
import GroupsService from "../services/groups.service";

export default function GroupSettingsDataScreen({ route, navigation }) {
  const { id } = route.params;
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => [300], []);

  React.useEffect(() => {
    setEditing(false);
    setRefreshing(true);
    GroupsService.getGroup(id as string).then((response: any) => {
      setGroupName(response.data.name);
      setRefreshing(false);
    });
  }, [id]);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (editing) {
          return (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{ paddingRight: 5 }}
                onPress={() => {
                  setEditing(false);
                  setRefreshing(true);
                  GroupsService.updateGroupName("", id).then((response) => {
                    setGroupName(response.data.name);
                    setRefreshing(false);
                  });
                }}
              >
                <Ionicons name="close-outline" size={40} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingRight: 10, marginTop: -1 }}
                onPress={() => {
                  setEditing(false);
                  setRefreshing(true);
                  GroupsService.updateGroupName(groupName, id).then(
                    (response) => {
                      setGroupName(response.data.name);
                      setRefreshing(false);
                    }
                  );
                }}
              >
                <Ionicons name="checkmark" size={35} color={Colors.main} />
              </TouchableOpacity>
            </View>
          );
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const onRefresh = React.useCallback(() => {
    setEditing(false);
    setRefreshing(true);
    GroupsService.getGroup(id as string).then((response: any) => {
      setGroupName(response.data.name);
      setRefreshing(false);
    });
  }, [id]);

  return (
    <StyledScrollView
      style={{ padding: 10 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StyledText style={{ fontWeight: "900" }}>
        {t("settings_data")}:
      </StyledText>
      <View style={{ marginVertical: 10, marginBottom: 30 }}>
        <StyledText>{t("common:group_name")}:</StyledText>
        <StyledTextInput
          onChangeText={(e) => {
            setEditing(true);
            setGroupName(e);
          }}
          value={groupName}
          autoCapitalize="none"
        />
      </View>
      <StyledText style={{ fontWeight: "900" }}>
        {t("settings_danger")}:
      </StyledText>
      <StyledButton
        title={t("settings_group_delete")}
        onPress={() => {
          bottomSheetRef.current?.snapToIndex(0);
        }}
      />
      <StyledBottomSheet snapPoints={snapPoints} ref={bottomSheetRef}>
        <StyledText
          style={{ fontWeight: "900", fontSize: 24, marginBottom: 8 }}
        >
          {t("settings_group_delete_disclaimer_title")}
        </StyledText>
        <StyledText style={{ marginBottom: 10 }}>
          {t("settings_group_delete_disclaimer_text")}
        </StyledText>
        <StyledButton
          title={t("settings_group_delete_disclaimer_confirm")}
          onPress={() => {
            GroupsService.deleteGroup(id as string).then((response: any) => {
              if (response.status === 200) {
                bottomSheetRef.current?.close();
                navigation.navigate("groups");
              }
            });
          }}
        />
      </StyledBottomSheet>
    </StyledScrollView>
  );
}
