import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiX } from "react-icons/hi";
import { IoIosMusicalNotes } from "react-icons/io";
import { useParams } from "react-router";
import player from "react-web-track-player";
import AuthVerify from "../common/AuthVerify";
import Button from "../components/Button";
import { DateInput, SelectInput, TextInput } from "../components/Input";
import { SpeedDataInput } from "../components/SpeedData";
import { setRoute } from "../redux/route.action";
import { getGroup } from "../service/groups.service";
import {
  getScoreDataHigh,
  getScoreDataTypes,
  resetScoreData,
  saveScoreData,
} from "../service/scoredata.service";
import TRACKS, { musicData } from "../tracks";
import { classNames } from "../utils/classNames";
import { useWindowSize } from "react-use";
import { IoArrowForward } from "react-icons/all";
import Confetti from "react-confetti";
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

  useEffect(() => {
    getGroup(params.id as string).then((response: any) => {
      setGroupName(response.data?.name);
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

  function handleRecordDataSubmit(e: any) {
    e.preventDefault();
    const id = e.target.elements.id.value;
    const score = e.target.elements[id].value;
    saveScoreData(id, scoreDataType, score, date).then(() => {
      e.target.elements[id].value = null;
      getScoreDataHighFN(params.id, scoreDataType);
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
                <IoArrowForward />
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
      <div className="flex">
        <div className="shrink grow">
          <DateInput
            setDate={(e) => {
              setDate(e);
            }}
            date={date}
          />
        </div>
        {musicData[scoreDataType] &&
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
                              active && "bg-gray-100 dark:bg-gray-900",
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
      </div>
      <div className="mb-2 flex items-center space-x-2">
        <div className="w-full">
          <SelectInput
            options={typesOptions}
            current={scoreDataType}
            stateChange={setScoreDataType}
          />
        </div>
        <span className="whitespace-nowrap text-xs uppercase">
          {t<string>("common:high")}: {groupHigh}
        </span>
      </div>
      {groupScores &&
        groupScores.map((score: any) => {
          return (
            <SpeedDataInput
              key={score.user._id}
              id={score.user._id}
              name={capitalize(fullname(score.user))}
              score={score.score}
              onSubmit={(e) => {
                const type = e.target.elements.id.value;
                const score_new = e.target.elements[type].value;
                if (Number(score_new) > score.score) {
                  setModal({
                    old: score.score,
                    type: (typesOptions as any)?.find(
                      (t: any) => t.value === scoreDataType
                    )?.name,
                    new: Number(score_new),
                    name: capitalize(fullname(score.user)),
                  });
                }
                handleRecordDataSubmit(e);
              }}
              dropdown={[
                {
                  name: t("scoredata_dropdown_reset"),
                  props: {
                    onClick: () => {
                      setShowResetDialog({
                        type: score.type,
                        user: score.user._id,
                        username:
                          score.user.firstname && score.user.lastname
                            ? `${score.user.firstname} ${score.user.lastname}`
                            : score.user.username,
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
