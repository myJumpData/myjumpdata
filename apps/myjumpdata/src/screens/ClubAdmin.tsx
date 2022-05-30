import { Menu, Transition } from "@headlessui/react";
import { Fragment, ReactChild, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiDotsVertical, HiUserAdd, HiUserRemove } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import AuthVerify from "../common/AuthVerify";
import Button from "../components/Button";
import { TextInput } from "../components/Input";
import Spinner from "../components/Spinner";
import { setRoute } from "../redux/route.action";
import {
  addAdminToClub,
  addCoachToClub,
  addMemberToClub,
  getClub,
  removeAdminFromClub,
  removeCoachFromClub,
  removeMemberFromClub,
} from "../service/groups.service";
import { searchUsersAll } from "../service/users.service";
import fullname from "../utils/fullname";

export default function ClubAdminScreen() {
  useEffect(() => {
    setRoute("group");
    AuthVerify();
  }, []);

  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const { t } = useTranslation();
  const [groupSearch, setGroupSearch] = useState("");
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [club, setClub] = useState<any>();

  const onRefresh = () => {
    getClub().then((response) => {
      setClub(response.data);
      setUsers(
        [
          ...response.data.athletes,
          ...response.data.coaches,
          ...response.data.admins,
        ].filter(
          (value, index, self) =>
            index === self.findIndex((t) => t._id === value._id)
        )
      );
      if (!response.data.admins?.some((i: any) => i._id === user.id)) {
        navigate(-1);
      }
    });
  };

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, user.id]);

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      if (groupSearch !== "") {
        searchUsersAll(groupSearch).then((response) => {
          setUsers(
            [
              ...response.data,
              ...(club
                ? [...club.athletes, ...club.coaches, ...club.admins]
                : []),
            ].filter(
              (value, index, self) =>
                index === self.findIndex((t) => t._id === value._id)
            )
          );
          setLoading(false);
        });
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [club, groupSearch]);

  return (
    <>
      <div className="w-full space-y-2">
        <span className="text-xl font-bold">
          {club?.name + " - " + t<string>("common:nav_admin")}
        </span>
      </div>
      <div>
        <span className="text-xl font-bold">Mitglieder im Verein</span>
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
          {users?.map(
            ({
              _id,
              firstname,
              lastname,
              username,
            }: {
              _id: string;
              firstname: string;
              lastname: string;
              username: string;
            }) => {
              return (
                <div
                  className="flex flex-row items-center justify-between rounded-lg bg-gray-500/50 py-2 px-4"
                  key={_id}
                >
                  <div>
                    <span className="mr-2 truncate capitalize">
                      {fullname({ firstname, lastname, username })}
                    </span>

                    {firstname && lastname && (
                      <span className="truncate text-sm font-thin">
                        ({username})
                      </span>
                    )}
                  </div>

                  <div className="flex flex-row items-center justify-end space-x-2">
                    {club.coaches.some(
                      (athlete: any) => athlete._id === _id
                    ) && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-blue-500 text-sm">
                        C
                      </span>
                    )}
                    {club.athletes.some(
                      (athlete: any) => athlete._id === _id
                    ) && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-orange-500 text-sm">
                        A
                      </span>
                    )}
                    {club.admins.some((admin: any) => admin._id === _id) && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-red-500 text-sm">
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
                          {!club.athletes.some((u: any) => u._id === _id) &&
                          !club.admins.some((u: any) => u._id === _id) &&
                          !club.coaches.some((u: any) => u._id === _id) ? (
                            <MenuItem
                              icon={<HiUserAdd />}
                              name={"Add as Member"}
                              onClick={() => {
                                addMemberToClub(club._id, _id).then(() => {
                                  onRefresh();
                                });
                              }}
                            />
                          ) : (
                            <>
                              {club.coaches.some((u: any) => u._id === _id) ? (
                                <MenuItem
                                  icon={<HiUserRemove />}
                                  name={"Remove Coach Status"}
                                  onClick={() => {
                                    removeCoachFromClub(club._id, _id).then(
                                      () => {
                                        onRefresh();
                                      }
                                    );
                                  }}
                                />
                              ) : (
                                <MenuItem
                                  icon={<HiUserAdd />}
                                  name={"Make Coach"}
                                  onClick={() => {
                                    addCoachToClub(club._id, _id).then(() => {
                                      onRefresh();
                                    });
                                  }}
                                />
                              )}
                              {club.admins.some((u: any) => u._id === _id) ? (
                                <MenuItem
                                  icon={<HiUserRemove />}
                                  name={"Remove Admin Status"}
                                  onClick={() => {
                                    removeAdminFromClub(club._id, _id).then(
                                      () => {
                                        onRefresh();
                                      }
                                    );
                                  }}
                                />
                              ) : (
                                <MenuItem
                                  icon={<HiUserAdd />}
                                  name={"Make Admin"}
                                  onClick={() => {
                                    addAdminToClub(club._id, _id).then(() => {
                                      onRefresh();
                                    });
                                  }}
                                />
                              )}
                              <MenuItem
                                icon={<HiUserRemove />}
                                name={"Remove Member"}
                                onClick={() => {
                                  removeMemberFromClub(club._id, _id).then(
                                    () => {
                                      onRefresh();
                                    }
                                  );
                                }}
                              />
                            </>
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
      <Link to={`/group/`}>
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
