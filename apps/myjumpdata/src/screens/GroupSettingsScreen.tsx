import { Menu, Transition } from "@headlessui/react";
import { Fragment, ReactChild, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiDotsVertical, HiUserAdd, HiUserRemove } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import AuthVerify from "../common/AuthVerify";
import Button from "../components/Button";
import { TextInput } from "../components/Input";
import Spinner from "../parts/Spinner";
import Wrapper from "../parts/Wrapper";
import GroupsService from "../services/groups.service";
import UsersService from "../services/users.service";

export default function GroupSettingsScreen() {
  AuthVerify();
  const params = useParams();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const { t } = useTranslation();
  const [groupCoaches, setGroupCoaches] = useState([]);
  const [groupAthletes, setGroupAthletes] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupUpdateName, setGroupUpdateName] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [delStep, setDelStep] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      groupCoaches.length > 0 &&
      !groupCoaches.some((i: any) => i.id === user.id)
    ) {
      navigate(-1);
    }
  }, [navigate, user, groupCoaches]);

  useEffect(() => {
    getGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  function getGroup() {
    GroupsService.getGroup(params.id).then((response: any) => {
      setGroupName(response.data.name);
      setGroupCoaches(response.data.coaches);
      setGroupAthletes(response.data.athletes);
    });
  }

  useEffect(() => {
    if (groupUpdateName === "") {
      setGroupUpdateName(groupName);
    }
  }, [groupName, groupUpdateName]);

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      if (groupSearch !== "") {
        UsersService.searchUsers(groupSearch).then((response) => {
          setUsers(response.data);
          setLoading(false);
        });
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [groupSearch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (groupName !== groupUpdateName) {
        GroupsService.updateGroupName(groupUpdateName, params.id).then(
          (response: any) => {
            setGroupName(response.data.name);
          }
        );
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [groupName, groupUpdateName, params]);

  return (
    <Wrapper current="group_settings">
      <div className="w-full space-y-2">
        <span className="font-bold text-xl">
          {groupName + " " + t("common:nav.settings")}
        </span>
      </div>
      <span className="text-2xl font-bold">{t("settings.data")}: </span>
      <TextInput
        type="text"
        name={t("common:fields.group_name") + ":"}
        stateChange={setGroupUpdateName}
        value={groupUpdateName}
      />
      <div>
        <span className="text-xl font-bold">Mitglieder der Gruppe</span>
        <div className="mt-4">
          <TextInput
            type="text"
            name={t("common:action.search") + ":"}
            stateChange={setGroupSearch}
            value={groupSearch}
          />
        </div>
        <div className="flex flex-col space-y-2">
          {loading && groupSearch !== "" && (
            <div className="h-28">
              <Spinner />
            </div>
          )}
          {groupSearch !== "" &&
            users &&
            users.map(
              ({
                _id,
                firstname,
                lastname,
                username,
                roles,
              }: {
                _id: string;
                firstname: string;
                lastname: string;
                username: string;
                roles: [];
              }) => {
                return (
                  <div
                    className="bg-gray-500/50 flex flex-row py-2 px-4 rounded-lg items-center justify-between"
                    key={_id}
                  >
                    <div>
                      <span className="truncate capitalize mr-2">
                        {firstname && lastname
                          ? `${firstname} ${lastname}`
                          : username}
                      </span>

                      {firstname && lastname && (
                        <span className="truncate text-sm font-thin">
                          ({username})
                        </span>
                      )}
                    </div>

                    <div className="flex flex-row items-center justify-end space-x-2">
                      {groupCoaches.some(
                        (athlete: any) => athlete.id === _id
                      ) && (
                        <span className="flex justify-center items-center h-6 w-6 rounded-lg border-2 border-blue-500 text-sm">
                          C
                        </span>
                      )}
                      {groupAthletes.some(
                        (athlete: any) => athlete.id === _id
                      ) && (
                        <span className="flex justify-center items-center h-6 w-6 rounded-lg border-2 border-orange-500 text-sm">
                          A
                        </span>
                      )}
                      <Menu as="div" className="relative">
                        <Menu.Button className="flex justify-center items-center h-8 w-8 rounded-full hover:outline outline-gray-500">
                          <HiDotsVertical />
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute right-0 mt-4 top-4 max-w-36 rounded-md shadow-lg py-1 bg-white text-gray-800 dark:bg-black dark:text-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                            {roles.some((e: any) => e.name === "coach") &&
                              !groupCoaches.some(
                                (athlete: any) => athlete.id === _id
                              ) && (
                                <MenuItem
                                  icon={<HiUserAdd />}
                                  name={t(
                                    "settings_group.user_action.add_coach"
                                  )}
                                  onClick={() => {
                                    GroupsService.addCoachesToGroup(params.id, [
                                      _id,
                                    ]).then(() => {
                                      getGroup();
                                    });
                                  }}
                                />
                              )}
                            {groupCoaches.some(
                              (athlete: any) => athlete.id === _id
                            ) && (
                              <MenuItem
                                icon={<HiUserRemove />}
                                name={t(
                                  "settings_group.user_action.remove_coach"
                                )}
                                onClick={() => {
                                  GroupsService.removeCoachesFromGroup(
                                    params.id,
                                    [_id]
                                  ).then(() => {
                                    getGroup();
                                  });
                                }}
                              />
                            )}
                            {!groupCoaches.some(
                              (coach: any) => coach.id === _id
                            ) &&
                              !groupAthletes.some(
                                (athlete: any) => athlete.id === _id
                              ) && (
                                <MenuItem
                                  icon={<HiUserAdd />}
                                  name={t(
                                    "settings_group.user_action.add_athlete"
                                  )}
                                  onClick={() => {
                                    GroupsService.addUsersToGroup(params.id, [
                                      _id,
                                    ]).then(() => {
                                      getGroup();
                                    });
                                  }}
                                />
                              )}
                            {groupAthletes.some(
                              (athlete: any) => athlete.id === _id
                            ) && (
                              <MenuItem
                                icon={<HiUserRemove />}
                                name={t(
                                  "settings_group.user_action.remove_athlete"
                                )}
                                onClick={() => {
                                  GroupsService.removeUsersFromGroup(
                                    params.id,
                                    [_id]
                                  ).then(() => {
                                    getGroup();
                                  });
                                }}
                              />
                            )}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                );
              }
            )}
        </div>
      </div>

      <div className="w-full space-y-2">
        <span className="font-bold text-xl">{t("settings.danger")}</span>
      </div>
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
              GroupsService.deleteGroup(params.id).then((response: any) => {
                if (response.status === 200) {
                  setDelStep(0);
                  navigate("/groups");
                }
              });
            }}
          />
        </div>
      </div>
      <Link to={`/group/${params.id}/`}>
        <Button name={t("common:interact.back")} design="link" />
      </Link>
    </Wrapper>
  );

  function MenuItem({
    onClick,
    icon,
    name,
  }: {
    onClick: () => void;
    icon: ReactChild;
    name: string;
  }) {
    return (
      <Menu.Item
        as="span"
        className="flex items-center justify-start px-4 py-2 text-sm leading-none hover:bg-gray-500/50 cursor-pointer"
        onClick={() => {
          onClick();
        }}
      >
        <span className="text-lg mr-2">{icon}</span>
        <span className="whitespace-nowrap">{name}</span>
      </Menu.Item>
    );
  }
}
