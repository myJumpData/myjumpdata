import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import AuthVerify from "../common/AuthVerify";
import Alert from "../components/Alert";
import Button from "../components/Button";
import {TextInput} from "../components/Input";
import Main from "../components/Main";
import PageSpacer from "../components/PageSpacer";
import {Section} from "../components/Section";
import WaveSeperator from "../components/WaveSeperator";
import {MainFooter} from "../parts/MainFooter";
import {ScreenNav} from "../parts/ScreenNav";
import AuthService from "../services/auth.service";
import GroupsService from "../services/groups.service";

export default function GropsScreen() {
  AuthVerify();

  const {isCoach} = AuthService.getCurrentUser();
  const {t} = useTranslation();

  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState("");
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    getGroups();
  }, []);

  function getGroups() {
    GroupsService.getGroups().then(
      (response: any) => {
        setGroups(response.data.groups);
      },
      (error: any) => {
        setMessage(error.response?.data?.message.text);
      }
    );
  }

  function handleCreateGroup() {
    GroupsService.createGroup(groupName.trim()).then(
      () => {
        getGroups();
        setGroupName("");
      },
      (error: any) => {
        setMessage(error.response?.data?.message.text);
      }
    );
  }

  return (
    <Main>
      <ScreenNav name={t("common:action.train_group")}/>
      <PageSpacer/>
      {message && <Alert design="warning" text={message}/>}

      <WaveSeperator/>
      <Section heading={t("common:action.train_group")}>
        <div
          className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4 space-y-4 sm:space-y-0">
          {groups.map((group: any) => (
            <Link
              to={`/group/${group._id}`}
              key={group._id}
              className="w-full bg-gray-300 px-8 py-4 rounded-lg shadow h-16 overflow-ellipsis overflow-hidden items-center flex md:justify-center hover:border hover:border-gray-400 hover:bg-gray-200"
            >
              <span className="font-bold text-xl">{group.name}</span>
            </Link>
          ))}
        </div>
      </Section>
      {isCoach && (
        <Section heading={t("common:action.create_group")}>
          <div className="w-full bg-gray-200 px-6 py-4 rounded-lg max-w-prose mx-auto">
            <TextInput
              name={t("common:fields.group_name") + ":"}
              type="text"
              value={groupName}
              stateChange={setGroupName}
            />
            <Button
              name={t("common:action.create_group")}
              onClick={handleCreateGroup}
              design="success"
            />
          </div>
        </Section>
      )}
      <WaveSeperator rotated/>
      <MainFooter/>
    </Main>
  );
}
