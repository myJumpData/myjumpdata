import * as React from "react";
import { useTranslation } from "react-i18next";
import { StyledButton } from "../components/StyledButton";
import { StyledText } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledScrollView, StyledView } from "../components/StyledView";
import GroupsService from "../services/groups.service";

export default function GroupCreateScreen({ navigation }) {
  const [groupname, setGroupname] = React.useState<string>("");
  const { t } = useTranslation();

  function handleCreateGroup() {
    GroupsService.createGroup(groupname.trim()).then(() => {
      setGroupname("");
      navigation.navigate("Groups");
    });
  }

  return (
    <StyledScrollView
      style={{
        padding: 10,
      }}
    >
      <StyledView
        style={{
          paddingVertical: 10,
        }}
      >
        <StyledText>{t("common:fields.group_name")}:</StyledText>
        <StyledTextInput
          onChangeText={setGroupname}
          value={groupname}
          autoFocus
        />
      </StyledView>
      <StyledView
        style={{
          paddingVertical: 10,
        }}
      >
        <StyledButton
          title={t("common:action.create_group")}
          onPress={handleCreateGroup}
        />
      </StyledView>
    </StyledScrollView>
  );
}
