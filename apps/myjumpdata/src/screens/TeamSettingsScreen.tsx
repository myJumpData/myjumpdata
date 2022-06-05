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
import { searchUsers } from "../service/users.service";
import {
  addCoachesToTeam,
  addUsersToTeam,
  deleteTeam,
  getTeam,
  removeCoachesFromTeam,
  removeUsersFromTeam,
  updateTeamName,
} from "../service/team.service";

export default function TeamSettingsScreen() {
  useEffect(() => {
    setRoute("group");
    AuthVerify();
  }, []);

  const params = useParams();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const { t } = useTranslation();
  const [teamCoaches, setTeamCoaches] = useState([]);
  const [teamAthletes, setTeamAthletes] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [teamUpdateName, setTeamUpdateName] = useState("");
  const [teamSearch, setTeamSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [delStep, setDelStep] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      teamCoaches.length > 0 &&
      !teamCoaches.some((i: any) => i.id === user.id)
    ) {
      navigate(-1);
    }
  }, [navigate, user, teamCoaches]);

  useEffect(() => {
    getGroupFN();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  function getGroupFN() {
    getTeam(params.id as string).then((response: any) => {
      if (response.data) {
        setTeamName(response.data.name);
        setTeamCoaches(response.data.coaches);
        setTeamAthletes(response.data.athletes);
      }
    });
  }

  useEffect(() => {
    if (teamUpdateName === "") {
      setTeamUpdateName(teamName);
    }
  }, [teamName, teamUpdateName]);

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      if (teamSearch !== "") {
        searchUsers(teamSearch).then((response) => {
          setUsers(response.data);
          setLoading(false);
        });
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [teamSearch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (teamName !== teamUpdateName) {
        updateTeamName(teamUpdateName, params.id as string).then(
          (response: any) => {
            setTeamName(response.data?.name);
          }
        );
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [params, teamName, teamUpdateName]);

  return (
    <>
      <div className="w-full space-y-2">
        <span className="text-xl font-bold">
          {teamName + " " + t<string>("common:nav_settings")}
        </span>
      </div>
      <span className="text-2xl font-bold">{t<string>("settings_data")}: </span>
      <TextInput
        type="text"
        name={t("common:team_name") + ":"}
        stateChange={setTeamUpdateName}
        value={teamUpdateName}
      />
      <div>
        <span className="text-xl font-bold">Mitglieder des Teams</span>
        <div className="mt-4">
          <TextInput
            type="text"
            name={t("common:search") + ":"}
            stateChange={setTeamSearch}
            value={teamSearch}
          />
        </div>
        <div className="flex flex-col space-y-2">
          {loading && teamSearch !== "" && (
            <div className="h-28">
              <Spinner />
            </div>
          )}
          {teamSearch !== "" &&
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
                      {teamCoaches.some(
                        (athlete: any) => athlete.id === _id
                      ) && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-blue-500 text-sm">
                          C
                        </span>
                      )}
                      {teamAthletes.some(
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
                              !teamCoaches.some(
                                (athlete: any) => athlete.id === _id
                              ) && (
                                <MenuItem
                                  icon={<HiUserAdd />}
                                  name={t(
                                    "settings_team_user_action_add_coach"
                                  )}
                                  onClick={() => {
                                    addCoachesToTeam(params.id as string, [
                                      _id,
                                    ]).then(() => {
                                      getGroupFN();
                                    });
                                  }}
                                />
                              )}
                            {teamCoaches.some(
                              (athlete: any) => athlete.id === _id
                            ) && (
                              <MenuItem
                                icon={<HiUserRemove />}
                                name={t(
                                  "settings_team_user_action_remove_coach"
                                )}
                                onClick={() => {
                                  removeCoachesFromTeam(params.id as string, [
                                    _id,
                                  ]).then(() => {
                                    getGroupFN();
                                  });
                                }}
                              />
                            )}
                            {!teamCoaches.some(
                              (coach: any) => coach.id === _id
                            ) &&
                              !teamAthletes.some(
                                (athlete: any) => athlete.id === _id
                              ) && (
                                <MenuItem
                                  icon={<HiUserAdd />}
                                  name={t(
                                    "settings_team_user_action_add_athlete"
                                  )}
                                  onClick={() => {
                                    addUsersToTeam(params.id as string, [
                                      _id,
                                    ]).then(() => {
                                      getGroupFN();
                                    });
                                  }}
                                />
                              )}
                            {teamAthletes.some(
                              (athlete: any) => athlete.id === _id
                            ) && (
                              <MenuItem
                                icon={<HiUserRemove />}
                                name={t(
                                  "settings_team_user_action_remove_athlete"
                                )}
                                onClick={() => {
                                  removeUsersFromTeam(params.id as string, [
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
        name={t("settings_team_delete")}
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
            {t<string>("settings_team_delete_disclaimer_title")}
          </span>
          <span>{t<string>("settings_team_delete_disclaimer_text")}</span>
          <Button
            name={t<string>("settings_team_delete_disclaimer_confirm")}
            design="danger"
            onClick={() => {
              deleteTeam(params.id as string).then((response: any) => {
                if (response.status === 200) {
                  setDelStep(0);
                  navigate("/group");
                }
              });
            }}
          />
        </div>
      </div>
      <Link to={`/team/${params.id}/`}>
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
