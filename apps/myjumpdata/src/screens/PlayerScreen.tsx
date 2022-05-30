import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { setRoute } from "../redux/route.action";
import { getLibrary } from "../service/player.service";
import PlaceholderMusic from "../assets/music_placeholder.png";
import player from "react-web-track-player";
import { IoAdd, IoClose, IoMdTrash } from "react-icons/all";
import { setMessage } from "../redux/message.action";
import Button from "../components/Button";
import api from "../service/api";
import getApi from "../utils/getApi";
import { useSelector } from "react-redux";
import fullname from "../utils/fullname";
import { capitalize } from "../utils/capitalize";

export default function PlayerScreen() {
  useEffect(() => {
    setRoute("player");
  }, []);

  const { t } = useTranslation();

  const [freestyleTracks, setFreestyleTracks] = useState([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [del, setDel] = useState(false);
  const [current, setCurrent] = useState<any | null>(null);
  const user = useSelector((state: any) => state.user);

  const getFreestyleTracks = () => {
    api.get("/track/freestyle").then((res) => {
      setFreestyleTracks(
        res.data.freestyleTracks.map(({ id, name }) => {
          return {
            id,
            url: `${getApi()}/upload/${id}`,
            title: name,
            artist: capitalize(fullname(user)),
          };
        })
      );
    });
  };

  useEffect(() => {
    getFreestyleTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="w-full space-y-2">
        <span className="text-xl font-bold">
          {t<string>("common:nav_player")}
        </span>
      </div>
      <div>
        <div className="w-full space-y-2">
          <span className="text-lg font-bold">Freestyle-Tracks</span>
        </div>
        <div>
          {freestyleTracks.length > 0 ? (
            freestyleTracks.map((item: any, index) => (
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
          ) : (
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
                  <IoAdd />
                </>
              )}
            </div>
          )}
        </div>
        {selectedFile ? (
          <Button
            name="Upload"
            design="success"
            onClick={() => {
              const formData = new FormData();

              formData.append("file", selectedFile, selectedFile.name);

              api.post("/upload/track/freestyle", formData).then(() => {
                setSelectedFile(null);
                getFreestyleTracks();
              });
            }}
          />
        ) : null}
      </div>
      <div>
        <div className="w-full space-y-2">
          <span className="text-lg font-bold">Speed-Tracks</span>
        </div>
        <div>
          {getLibrary().map((item: any, index) => (
            <TrackItem track={item} key={index} />
          ))}
        </div>
      </div>
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
                .post("/delete/track/freestyle", { id: current.item.id })
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

export const TrackItem = ({ track }: any) => {
  return (
    <div
      className="my-4 flex w-full cursor-pointer items-center space-x-2 rounded hover:bg-gray-500/10"
      onClick={async () => {
        await player.reset();
        await player.add([
          {
            id: track.id,
            url: track.url,
            title: track.title,
            artist: track.artist,
          },
        ]);
        await player.play();
      }}
    >
      <div className="flex aspect-square h-12 justify-center overflow-hidden rounded">
        <img
          src={track.artwork ? track.artwork : PlaceholderMusic}
          className="object-cover"
          alt="Thumbnail"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold">{track.title}</span>
        <span className="text-sm opacity-75">{track.artist}</span>
      </div>
    </div>
  );
};
