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
import Spinner from "../components/Spinner";
import { setRoute } from "../redux/route.action";
import {
  addCoachesToGroup,
  addUsersToGroup,
  deleteGroup,
  getGroup,
  removeCoachesFromGroup,
  removeUsersFromGroup,
  updateGroupName,
} from "../service/groups.service";
import { searchUsers } from "../service/users.service";

export default function GroupSettingsScreen() {
  useEffect(() => {
    setRoute("group");
    AuthVerify();
  }, []);

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
    getGroupFN();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  function getGroupFN() {
    getGroup(params.id as string).then((response: any) => {
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
        searchUsers(groupSearch).then((response) => {
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
        updateGroupName(groupUpdateName, params.id as string).then(
          (response: any) => {
            setGroupName(response.data.name);
          }
        );
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [groupName, groupUpdateName, params]);

  return (
    <>
      <div className="w-full space-y-2">
        <span className="text-xl font-bold">
          {groupName + " " + t<string>("common:nav_settings")}
        </span>
      </div>
      <span className="text-2xl font-bold">{t<string>("settings_data")}: </span>
      <TextInput
        type="text"
        name={t("common:group_name") + ":"}
        stateChange={setGroupUpdateName}
        value={groupUpdateName}
      />
      <div>
        <span className="text-xl font-bold">Mitglieder der Gruppe</span>
        <div className="mt-4">
          <TextInput
            type="text"
            name={t("common:search") + ":"}
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
                    className="flex flex-row items-center justify-between rounded-lg bg-gray-500/50 py-2 px-4"
                    key={_id}
                  >
                    <div>
                      <span className="mr-2 truncate capitalize">
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
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-blue-500 text-sm">
                          C
                        </span>
                      )}
                      {groupAthletes.some(
                        (athlete: any) => athlete.id === _id
                      ) && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-orange-500 text-sm">
                          A
                        </span>
                      )}
                      <Menu as="div" className="relative">
                        <Menu.Button className="flex h-8 w-8 items-center justify-center rounded-full outline-gray-500 hover:outline">
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
                          <Menu.Items className="max-w-36 absolute right-0 top-4 z-10 mt-4 origin-top-right rounded-md bg-white py-1 text-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black dark:text-gray-200">
                            {roles.some((e: any) => e.name === "coach") &&
                              !groupCoaches.some(
                                (athlete: any) => athlete.id === _id
                              ) && (
                                <MenuItem
                                  icon={<HiUserAdd />}
                                  name={t(
                                    "settings_group_user_action_add_coach"
                                  )}
                                  onClick={() => {
                                    addCoachesToGroup(params.id as string, [
                                      _id,
                                    ]).then(() => {
                                      getGroupFN();
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
                                  "settings_group_user_action_remove_coach"
                                )}
                                onClick={() => {
                                  removeCoachesFromGroup(params.id as string, [
                                    _id,
                                  ]).then(() => {
                                    getGroupFN();
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
                                    "settings_group_user_action_add_athlete"
                                  )}
                                  onClick={() => {
                                    addUsersToGroup(params.id as string, [
                                      _id,
                                    ]).then(() => {
                                      getGroupFN();
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
                                  "settings_group_user_action_remove_athlete"
                                )}
                                onClick={() => {
                                  removeUsersFromGroup(params.id as string, [
                                    _id,
                                  ]).then(() => {
                                    getGroupFN();
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
        <span className="text-xl font-bold">
          {t<string>("settings_danger")}
        </span>
      </div>
      <Button
        name={t("settings_group_delete")}
        design="danger"
        onClick={() => {
          setDelStep(1);
        }}
      />
      <div
        className={
          "top-0 left-0 flex h-full w-full flex-col justify-center p-4 backdrop-blur backdrop-filter " +
          (delStep === 1 ? "fixed z-50" : "z-0 hidden")
        }
        onClick={() => {
          setDelStep(0);
        }}
      >
        <div className="mx-auto flex max-w-prose flex-col space-y-4 rounded-lg bg-gray-300 bg-opacity-50 p-4">
          <span className="text-xl font-bold">
            {t<string>("settings_group_delete_disclaimer_title")}
          </span>
          <span>{t<string>("settings_group_delete_disclaimer_text")}</span>
          <Button
            name={t<string>("settings_group_delete_disclaimer_confirm")}
            design="danger"
            onClick={() => {
              deleteGroup(params.id as string).then((response: any) => {
                if (response.status === 200) {
                  setDelStep(0);
                  navigate("/group");
                }
              });
            }}
          />
        </div>
      </div>
      <Link to={`/group/${params.id}/`}>
        <Button name={t("common:back")} design="link" />
      </Link>
    </>
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
        className="flex cursor-pointer items-center justify-start px-4 py-2 text-sm leading-none hover:bg-gray-500/50"
        onClick={() => {
          onClick();
        }}
      >
        <span className="mr-2 text-lg">{icon}</span>
        <span className="whitespace-nowrap">{name}</span>
      </Menu.Item>
    );
  }
}
