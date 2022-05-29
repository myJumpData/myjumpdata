import * as React from "react";
import { useTranslation } from "react-i18next";
import { StyledButton } from "../components/StyledButton";
import { StyledText } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledView } from "../components/StyledView";
import GroupsService from "../services/groups.service";
import Wrapper from "../components/Wrapper";

export default function GroupCreateScreen({ navigation }) {
  const [groupname, setGroupname] = React.useState<string>("");
  const { t } = useTranslation();

  function handleCreateGroup() {
    GroupsService.createGroup(groupname.trim()).then(() => {
      setGroupname("");
      navigation.navigate("groups");
    });
  }

  return (
    <Wrapper>
      <StyledView
        style={{
          paddingVertical: 10,
        }}
      >
        <StyledText>{t("common:group_name")}:</StyledText>
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
          title={t("common:create_group")}
          onPress={handleCreateGroup}
        />
      </StyledView>
    </Wrapper>
  );
}
