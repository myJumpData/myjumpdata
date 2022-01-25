import * as React from "react";
import { StyledButton } from "../components/StyledButton";
import { StyledText } from "../components/StyledText";
import { StyledTextInput } from "../components/StyledTextInput";
import { StyledScrollView, StyledView } from "../components/StyledView";
import GroupsService from "../services/groups.service";

export default function GroupCreateScreen({ navigation }) {
  const [groupname, setGroupname] = React.useState<string>("");

  function handleCreateGroup() {
    GroupsService.createGroup(groupname.trim()).then(() => {
      setGroupname("");
      navigation.navigate("Gruppen");
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
        <StyledText>Gruppen Name:</StyledText>
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
        <StyledButton title="Gruppe erstellen" onPress={handleCreateGroup} />
      </StyledView>
    </StyledScrollView>
  );
}
