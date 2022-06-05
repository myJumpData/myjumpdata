import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import AuthVerify from "../common/AuthVerify";
import { setRoute } from "../redux/route.action";
import { getGroup } from "../service/groups.service";
import api from "../service/api";
import getApi from "../utils/getApi";
import { capitalize } from "../utils/capitalize";
import fullname from "../utils/fullname";
import { IoAdd, IoClose, IoMdTrash } from "react-icons/all";
import { TrackItem } from "./PlayerScreen";
import Button from "../components/Button";
import { setMessage } from "../redux/message.action";
import { SelectInput } from "../components/Input";

export default function GroupPlayerScreen() {
  useEffect(() => {
    setRoute("group");
    AuthVerify();
  }, []);

  const params = useParams();

  const [groupName, setGroupName] = useState("");
  const { t } = useTranslation();

  const [freestyleTracks, setFreestyleTracks] = useState([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [users, setUsers] = useState([]);
  const [userSelect, setUserSelect] = useState([]);
  const [userSelected, setUserSelected] = useState("");
  const [del, setDel] = useState(false);
  const [current, setCurrent] = useState<any | null>(null);

  const getFreestyleTracks = () => {
    api.get("/track/freestyle_group/" + params.id).then((res) => {
      const data = res.data.users
        .map((user) => {
          if (user.freestyleTracks.length > 0) {
            return user.freestyleTracks.map((track) => {
              return {
                id: track.id,
                url: `${getApi()}/upload/${track.id}`,
                title: track.name,
                artist: capitalize(fullname(user)),
                artwork: user.picture,
              };
            });
          }
          return null;
        })
        .flat()
        .filter((n) => n);
      setFreestyleTracks(data);
    });
  };

  useEffect(() => {
    const filter: any = users.filter(
      (x: any) => !freestyleTracks.some((e: any) => e.artist === x.name)
    );
    setUserSelect(filter);
    setUserSelected(filter[0]?.value);
  }, [freestyleTracks, users]);

  useEffect(() => {
    getFreestyleTracks();
    getGroup(params.id as string).then((response: any) => {
      setGroupName(response.data?.name);
      const tmp = response.data?.athletes.map((e) => {
        return {
          name: capitalize(fullname(e)),
          value: e.id,
        };
      });
      setUsers(tmp);
      setUserSelected(tmp[0].value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  return (
    <>
      <span className="text-xl font-bold">
        {t("speeddata_title") + " " + groupName}
      </span>
      {freestyleTracks.length > 0
        ? freestyleTracks.map((item: any, index) => (
            <div
              className="flex items-center justify-between space-x-2"
              key={index}
            >
              <TrackItem track={item} />
              <span
                className="h-full cursor-pointer p-4 text-xl"
                onClick={() => {
                  setCurrent({ item });
                  setDel(true);
                }}
              >
                <IoMdTrash />
              </span>
            </div>
          ))
        : null}
      <div
        className={
          "flex items-center justify-center rounded-lg border-2" +
          " border-gray-500/50 p-4 text-2xl text-gray-500/50 transition hover:bg-gray-500/25 hover:text-black" +
          " relative cursor-pointer dark:hover:text-white"
        }
        onClick={() => {
          if (selectedFile) {
            setSelectedFile(null);
          }
        }}
      >
        {selectedFile ? (
          <div className="flex w-full items-center justify-between text-black dark:text-white">
            <div className="flex flex-col justify-center">
              <span className="text-base leading-none">
                {selectedFile.name}
              </span>
              <span className="text-base leading-none opacity-75">
                {selectedFile.type}
              </span>
            </div>
            <IoClose />
          </div>
        ) : (
          <>
            <input
              type="file"
              accept=".mp3,audio/mpeg"
              className="absolute top-0 left-0 right-0 bottom-0 opacity-0"
              onChange={(e) => {
                if (!e.target.files) {
                  return;
                }
                const file: any = e.target.files[0];
                if (file.type !== "audio/mpeg") {
                  return setMessage({
                    text: "File has to be of audio/mpeg Type",
                  });
                }
                setSelectedFile(file);
                return;
              }}
            />
            <div className="mb-2 flex w-full max-w-sm flex-col items-center space-y-4">
              <div className="w-full">
                <SelectInput
                  options={userSelect}
                  current={userSelected}
                  stateChange={setUserSelected}
                />
              </div>
              <IoAdd className="text-2xl" />
            </div>
          </>
        )}
      </div>
      {selectedFile ? (
        <Button
          name="Upload"
          design="success"
          onClick={() => {
            const formData = new FormData();

            formData.append("file", selectedFile, selectedFile.name);
            formData.set("user", userSelected);

            api
              .post(
                ("/upload/track_group/freestyle/" + params.id) as string,
                formData
              )
              .then(() => {
                setSelectedFile(null);
                getFreestyleTracks();
              });
          }}
        />
      ) : null}
      <DelOverlay />
    </>
  );
  function DelOverlay() {
    return (
      <div
        className={
          "top-0 left-0 flex h-full w-full flex-col justify-center p-4 backdrop-blur backdrop-filter " +
          (del ? "fixed z-50" : "z-0 hidden")
        }
        onClick={() => {
          setDel(false);
        }}
      >
        <div className="mx-auto flex max-w-prose flex-col space-y-4 rounded-lg bg-gray-300/75 p-4 dark:bg-gray-600/75">
          <Button
            name="Delete"
            design="danger"
            onClick={() => {
              api
                .post("/delete/track_group/freestyle/" + params.id, {
                  id: current.item.id,
                })
                .then(() => {
                  getFreestyleTracks();
                  setCurrent(null);
                  setDel(false);
                });
            }}
          />
        </div>
      </div>
    );
  }
}
