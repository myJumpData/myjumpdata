import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {FaMinus, FaPlus} from "react-icons/fa";
import {useNavigate, useParams} from "react-router";
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
import UsersService from "../services/users.service";

export default function GroupSettingsScreen() {
  AuthVerify();
  let params = useParams();
  let navigate = useNavigate();

  const {currentUser} = AuthService.getCurrentUser();
  const {t} = useTranslation();
  const [message, setMessage] = useState("");
  const [groupCoaches, setGroupCoaches] = useState([]);
  const [groupAthletes, setGroupAthletes] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupUpdateName, setGroupUpdateName] = useState("");
  const [tab, setTab] = useState("athletes");
  const [users, setUsers] = useState([]);
  const [delStep, setDelStep] = useState(0);

  useEffect(() => {
    if (
      groupCoaches.length > 0 &&
      !groupCoaches.some((i: any) => i._id === currentUser.id)
    ) {
      navigate(-1);
    }
  }, [navigate, currentUser, groupCoaches]);

  useEffect(() => {
    getGroup();
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  function getGroup() {
    GroupsService.getGroup(params.id).then(
      (response: any) => {
        setGroupName(response.data.group.name);
        setGroupCoaches(response.data.group.coaches);
        setGroupAthletes(response.data.group.athletes);
      },
      (error: any) => {
        setMessage(error.response?.data?.message.text);
      }
    );
  }

  function getUsers() {
    UsersService.getUsers().then(
      (response: any) => {
        setUsers(response.data.users);
      },
      (error: any) => {
        setMessage(error.response?.data?.message.text);
      }
    );
  }

  useEffect(() => {
    if (groupUpdateName === "") {
      setGroupUpdateName(groupName);
    }
  }, [groupName, groupUpdateName]);

  useEffect(() => {
    if (groupName !== groupUpdateName) {
      GroupsService.updateGroupName(groupUpdateName, params.id).then(
        (response: any) => {
          setMessage(response?.data?.message?.text);
          setGroupName(response.data.group.name);
        },
        (error: any) => {
          setMessage(error.response?.data?.message.text);
          setGroupUpdateName(groupName);
        }
      );
    }
  }, [groupName, groupUpdateName, params]);

  return (
    <Main>
      <ScreenNav name={groupName + " " + t("common:nav.settings")}/>
      <PageSpacer/>
      {message && <Alert design="warning" text={message}/>}

      <WaveSeperator/>
      <Section heading={groupName + " " + t("common:nav.settings")}>
        <div className="max-w-prose mx-auto">
          <span className="text-2xl font-bold">{t("settings.data")}: </span>
          <TextInput
            type="text"
            name={t("common:fields.group_name") + ":"}
            stateChange={setGroupUpdateName}
            value={groupUpdateName}
          />
          <span className="text-xl font-bold">
            {tab === "athletes" && t("common:role.athletes")}
            {tab === "coaches" && t("common:role.coaches")} in {groupName}
          </span>
          <div className="flex space-x-4">
            <Button
              name={t("common:role.athletes")}
              design={tab === "athletes" ? "primary" : "secondary"}
              onClick={() => {
                setTab("athletes");
              }}
            />
            <Button
              name={t("common:role.coaches")}
              design={tab === "coaches" ? "primary" : "secondary"}
              onClick={() => {
                setTab("coaches");
              }}
            />
          </div>
          <div className="mt-4">
            <div className="flex flex-col space-y-4 mt-4">
              {users.map((user: any) => {
                if (tab === "athletes") {
                  if (groupCoaches.some((athlete: any) => athlete._id === user._id) || user._id === currentUser.id) {
                    return <span key={user._id} className="hidden"/>;
                  }
                  if (groupAthletes.some((athlete: any) => athlete._id === user._id)) {
                    return (
                      <UserBox
                        onClick={() => {
                          GroupsService.removeUsersFromGroup(params.id, [
                            user._id,
                          ]).then(() => {
                            getGroup();
                            getUsers();
                          });
                        }}
                        remove
                        name={user.username}
                        key={user._id}
                      />
                    );
                  } else {
                    return (
                      <UserBox
                        onClick={() => {
                          GroupsService.addUsersToGroup(params.id, [
                            user._id,
                          ]).then(() => {
                            getGroup();
                            getUsers();
                          });
                        }}
                        name={user.username}
                        key={user._id}
                      />
                    );
                  }
                } else if (tab === "coaches") {
                  if (groupAthletes.some((coach: any) => coach._id === user._id)) {
                    return <span key={user._id} className="hidden"/>;
                  }
                  if (groupCoaches.some((coaches: any) => coaches._id === user._id)) {
                    return (
                      <UserBox
                        onClick={() => {
                          GroupsService.removeCoachesFromGroup(params.id, [
                            user._id,
                          ]).then(() => {
                            getGroup();
                            getUsers();
                          });
                        }}
                        remove
                        name={user.username}
                        key={user._id}
                      />
                    );
                  } else {
                    return (
                      <UserBox
                        onClick={() => {
                          GroupsService.addCoachesToGroup(params.id, [
                            user._id,
                          ]).then(() => {
                            getGroup();
                            getUsers();
                          });
                        }}
                        name={user.username}
                        key={user._id}
                      />
                    );
                  }
                } else {
                  return <span key={user._id} className="hidden"/>;
                }
              })}
            </div>
          </div>
        </div>
      </Section>
      <Section heading={t("settings.danger")}>
        <div className="max-w-prose mx-auto">
          <Button
            name={t("settings_group.delete")}
            design="danger"
            onClick={() => {
              setDelStep(1);
            }}
          />
          <div
            className={
              "top-0 left-0 h-full w-full backdrop-filter backdrop-blur p-4 flex flex-col justify-center " +
              (delStep === 1 ? "fixed z-50" : "hidden z-0")
            }
            onClick={() => {
              setDelStep(0);
            }}
          >
            <div className="max-w-prose p-4 bg-gray-300 rounded-lg bg-opacity-50 mx-auto flex flex-col space-y-4">
              <span className="font-bold text-xl">
                {t("settings_group.delete_disclaimer_title")}
              </span>
              <span>{t("settings_group.delete_disclaimer_text")}</span>
              <Button
                name={t("settings_group.delete_disclaimer_confirm")}
                design="danger"
                onClick={() => {
                  GroupsService.deleteGroup(params.id).then(
                    (response: any) => {
                      if (response.status === 200) {
                        setDelStep(0);
                        navigate("/groups");
                      }
                    },
                    (error: any) => {
                      setMessage(error.response?.data?.message.text);
                      setDelStep(0);
                    }
                  );
                }}
              />
            </div>
          </div>
        </div>
      </Section>
      <WaveSeperator rotated/>
      <MainFooter/>
    </Main>
  );

  function UserBox({
                     name,
                     remove,
                     onClick,
                   }: {
    name: string;
    remove?: boolean;
    onClick: any;
  }) {
    return (
      <div className="flex bg-gray-300 py-2 px-4 rounded-xl">
        <span className="w-full font-bold">{name}</span>
        <span
          className="text-xl self-center"
          onClick={() => {
            onClick();
          }}
        >
          {remove ? <FaMinus/> : <FaPlus/>}
        </span>
      </div>
    );
  }
}
