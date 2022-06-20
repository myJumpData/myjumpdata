import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { Fragment, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useTranslation } from "react-i18next";
import { IoArrowForward, IoMenu } from "react-icons/all";
import { HiX } from "react-icons/hi";
import { IoIosGitCompare, IoIosMusicalNotes } from "react-icons/io";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useWindowSize } from "react-use";
import player from "react-web-track-player";
import AuthVerify from "../common/AuthVerify";
import Button from "../components/Button";
import { DateInput, SelectInput, TextInput } from "../components/Input";
import { SpeedDataInput } from "../components/SpeedData";
import { switchPivot } from "../redux/pivot.action";
import { setRoute } from "../redux/route.action";
import { getGroup } from "../service/groups.service";
import {
  getScoreDataHigh,
  getScoreDataTypes,
  resetScoreData,
  saveScoreData,
} from "../service/scoredata.service";
import { getUserSearch } from "../service/users.service";
import TRACKS, { musicData } from "../tracks";
import { capitalize } from "../utils/capitalize";
import fullname from "../utils/fullname";

export default function SpeedDataScreen() {
  useEffect(() => {
    setRoute("group");
    AuthVerify();
  }, []);

  const params = useParams();

  const [groupName, setGroupName] = useState("");
  const { t } = useTranslation();
  const [groupScores, setGroupScores] = useState([]);
  const [groupHigh, setGroupHigh] = useState([]);
  const [scoreDataTypes, setScoreDataTypes] = useState([]);
  const [typesOptions, setTypesOptions] = useState([]);
  const [scoreDataType, setScoreDataType] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [showResetDialog, setShowResetDialog] = useState<any>();
  const { width, height } = useWindowSize();
  const [modal, setModal] = useState<any>(null);

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState("");
  const pivot = useSelector((state: any) => state.pivot);

  useEffect(() => {
    getGroup(params.id as string).then((response: any) => {
      setGroupName(response.data?.name);
      setUsers(response.data?.athletes);
      setSelectedUser(response.data?.athletes[0].id);
    });
    getScoreDataTypes().then((response: any) => {
      setScoreDataTypes(response.data);
      setScoreDataType(response.data[0]._id);
      getScoreDataHighFN(params.id, response.data[0]._id);
    });
  }, [params]);

  useEffect(() => {
    if (scoreDataType) {
      getScoreDataHighFN(params.id, scoreDataType);
    }
  }, [scoreDataType, params]);

  const getUser = () => {
    if (users && selectedUser) {
      const u: any = users.find((t: any) => t.id === selectedUser);
      if (u) {
        getUserSearch(u.username).then((res) => {
          setUser(res.data);
        });
      }
    }
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser, users]);

  useEffect(() => {
    const options: any = scoreDataTypes.map((type: any) => {
      return { value: type._id, name: type.name };
    });
    setTypesOptions(options);
  }, [scoreDataTypes]);

  function getScoreDataHighFN(id: any, type: any) {
    getScoreDataHigh(id, type).then((response: any) => {
      setGroupScores(response.data?.scores);
      setGroupHigh(response.data?.high);
    });
  }

  return (
    <>
      {modal ? (
        <>
          <div
            className={
              "fixed top-0 left-0 z-50 flex h-full w-full flex-col justify-center p-4 backdrop-blur backdrop-filter"
            }
            onClick={() => {
              setModal(null);
            }}
          >
            <div className="mx-auto flex max-w-prose flex-col justify-center space-y-2 rounded-lg bg-gray-300/75 p-4 text-center dark:bg-gray-600/75">
              <span className="text-xl font-bold leading-none">
                {modal.name}
              </span>
              <span className="text-xl font-bold leading-none">
                {modal.type}
              </span>
              <div className="flex items-center justify-center">
                <span className="text-xl font-bold leading-none">
                  {modal.old}
                </span>
                {Number(modal.old) < Number(modal.new) ? (
                  <IoArrowForward />
                ) : (
                  <IoMenu />
                )}
                <span className="text-xl font-bold leading-none">
                  {modal.new}
                </span>
              </div>
            </div>
          </div>
          <Confetti width={width} height={height} />
        </>
      ) : null}
      <span className="text-xl font-bold">
        {t("speeddata_title") + " " + groupName}
      </span>
      <div className="flex items-center">
        <div className="shrink grow">
          <DateInput
            setDate={(e) => {
              setDate(e);
            }}
            date={date}
          />
        </div>
        {pivot === "users" &&
          musicData[scoreDataType] &&
          musicData[scoreDataType].tracks.length > 0 && (
            <Menu as="div" className="relative ml-2">
              <div className="inset-y-0 flex items-center ring-0">
                <Menu.Button
                  className="flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-gray-800 dark:focus:ring-offset-white"
                  aria-label="more-action"
                >
                  <IoIosMusicalNotes className="text-2xl" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="max-w-48 absolute right-0 z-20 origin-top rounded-md border border-gray-500/50 bg-white py-1 text-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black dark:text-gray-200">
                  {TRACKS.filter((e) =>
                    musicData[scoreDataType].tracks.some((id) => id === e.id)
                  )
                    .map((t) => ({
                      name: t.title,
                      props: {
                        onClick: async () => {
                          await player.reset();
                          await player.add([t]);
                          await player.play();
                        },
                      },
                    }))
                    .map((e: any) => (
                      <Menu.Item key={e.name}>
                        {({ active }) => (
                          <span
                            className={classNames(
                              { "bg-gray-100 dark:bg-gray-900": active },
                              "flex cursor-pointer items-center justify-start px-4 py-2 text-sm leading-none"
                            )}
                            {...e.props}
                          >
                            <span className="whitespace-nowrap">{e.name}</span>
                          </span>
                        )}
                      </Menu.Item>
                    ))}
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        <span onClick={switchPivot}>
          <IoIosGitCompare className="text-2xl" />
        </span>
      </div>
      <div className="mb-2 flex items-center space-x-2">
        <div className="w-full">
          <SelectInput
            options={
              pivot === "users"
                ? typesOptions
                : users.map((u: any) => ({
                    value: u.id,
                    name: capitalize(fullname(u)),
                  }))
            }
            current={pivot === "users" ? scoreDataType : selectedUser}
            stateChange={pivot === "users" ? setScoreDataType : setSelectedUser}
          />
        </div>
        {pivot === "users" ? (
          <span className="whitespace-nowrap text-xs uppercase">
            {t<string>("common:high")}: {groupHigh}
          </span>
        ) : null}
      </div>
      {pivot === "users" &&
        groupScores &&
        groupScores.map((score: any) => {
          return (
            <SpeedDataInput
              key={score.user._id}
              id={score.user._id}
              name={capitalize(fullname(score.user))}
              score={score.score}
              onSubmit={(e) => {
                e.preventDefault();
                const type = e.target.elements.id.value;
                const score_new = e.target.elements[type].value;
                if (Number(score_new) >= Number(score.score)) {
                  setModal({
                    old: score.score,
                    type: (typesOptions as any)?.find(
                      (t: any) => t.value === scoreDataType
                    )?.name,
                    new: Number(score_new),
                    name: capitalize(fullname(score.user)),
                  });
                }

                const id = e.target.elements.id.value;
                const score2 = e.target.elements[id].value;
                saveScoreData(id, scoreDataType, score2, date).then(() => {
                  e.target.elements[id].value = null;
                  getScoreDataHighFN(params.id, scoreDataType);
                });
              }}
              dropdown={[
                {
                  name: t("scoredata_dropdown_reset"),
                  props: {
                    onClick: () => {
                      setShowResetDialog({
                        type: score.type,
                        user: score.user._id,
                        username: capitalize(fullname(score.user)),
                      });
                    },
                  },
                },
              ]}
            />
          );
        })}
      {groupScores &&
        users &&
        user &&
        typesOptions &&
        typesOptions.map((type: any) => {
          const highdata = user.highdata?.find(
            (t: any) => t.type === type.name
          );
          if (!user) {
            return null;
          }
          return (
            <SpeedDataInput
              key={type.value}
              id={user.id}
              name={type.name}
              score={highdata?.score || "0"}
              music={
                musicData[type.value] && musicData[type.value].tracks.length > 0
                  ? TRACKS.filter((e) =>
                      musicData[type.value].tracks.some((id) => id === e.id)
                    ).map((t) => ({
                      name: t.title,
                      props: {
                        onClick: async () => {
                          await player.reset();
                          await player.add([t]);
                          await player.play();
                        },
                      },
                    }))
                  : undefined
              }
              onSubmit={(e) => {
                e.preventDefault();
                const type2 = e.target.elements.id.value;
                const score_new = e.target.elements[type2].value;
                if (Number(score_new) >= Number(highdata?.score || "0")) {
                  setModal({
                    old: highdata?.score || "0",
                    type: type.name,
                    new: Number(score_new),
                    name: capitalize(fullname(user)),
                  });
                }

                const id = e.target.elements.id.value;
                const score = e.target.elements[id].value;
                saveScoreData(user.id, type.value, score, date).then(() => {
                  getUser();
                  e.target.elements[id].value = null;
                });
              }}
              dropdown={[
                {
                  name: t("scoredata_dropdown_reset"),
                  props: {
                    onClick: () => {
                      setShowResetDialog({
                        type: type,
                        user: user.id,
                        username: capitalize(fullname(user)),
                      });
                    },
                  },
                },
              ]}
            />
          );
        })}
      <div
        className={
          "top-0 left-0 flex h-full w-full flex-col justify-center p-4 backdrop-blur backdrop-filter " +
          (showResetDialog ? "fixed z-50" : "z-0 hidden")
        }
      >
        <div className="relative mx-auto flex min-w-[16rem] max-w-prose flex-col space-y-2 rounded-lg bg-gray-500/25 p-4">
          <span
            className="absolute -right-12 -top-12 cursor-pointer p-8"
            onClick={() => {
              setShowResetDialog(undefined);
            }}
          >
            <HiX />
          </span>
          <span className="text-xl font-bold">
            {t<string>("scoredata_reset_title") +
              " | " +
              showResetDialog?.username}
          </span>
          <span>{t<string>("scoredata_reset_text")}</span>
          <span className="font-bold">
            {t<string>("scoredata_reset_warning")}
          </span>
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              resetScoreData(
                showResetDialog?.user,
                scoreDataType,
                e.target.elements.score.value
              ).then(() => {
                setShowResetDialog(undefined);
                getScoreDataHighFN(params.id, scoreDataType);
              });
            }}
          >
            <input type="hidden" name="id" value={showResetDialog?.type._id} />
            <div className="flex items-center space-x-2">
              <TextInput type="number" min="0" inputName="score" />
            </div>
            <Button type="submit" name={"Zurücksetzen"} design="danger" />
          </form>
        </div>
      </div>
    </>
  );
}
