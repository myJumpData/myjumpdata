import { lazy, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaAngleDown, FaCircle, FaInstagram } from "react-icons/fa";
import { HiCog, HiUser } from "react-icons/hi";
import {
  IoIosList,
  IoIosPause,
  IoIosPlay,
  IoIosSkipBackward,
  IoIosSkipForward,
  IoIosSquare,
  IoIosTimer,
  IoMdPeople,
} from "react-icons/io";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import player, {
  usePlaybackState,
  usePlaybackTrackChanged,
  useTrackPlayerProgress,
} from "react-web-track-player";
import PlaceholderMusic from "../assets/music_placeholder.png";
import FooterNav from "../components/FooterNav";
import Navbar from "../components/Navbar";
import { getUserSearch } from "../service/users.service";
import Alert from "./Alert";
import useBreakpoint from "../hooks/useBreakpoint";
import { IoAppsOutline, IoMusicalNotes } from "react-icons/all";
import { classNames } from "../utils/classNames";

const AdminNav = lazy(() => import("./AdminNav"));

export default function Wrapper({ children }: { children: ReactNode }) {
  const user = useSelector((state: any) => state.user);
  const route = useSelector((state: any) => state.route);
  const { t } = useTranslation();

  const [image, setImage] = useState<null | string>(null);

  const breakpoint = useBreakpoint();
  const isSmall = breakpoint === "xs" || breakpoint === "sm";

  function getNavData() {
    let dropdown: any[] = [];
    let dropdownButton;
    let navigation: any[] = [];
    let bottom: any[] = [];
    let action: any = null;

    if (!isSmall) {
      navigation = [
        ...navigation,
        {
          name: t("common:nav_home"),
          to: "/",
          current: route === "home",
        },
      ];
    }
    if (Object.keys(user).length !== 0) {
      if (!isSmall) {
        dropdown = [
          {
            icon: <HiUser />,
            name: t("common:nav_profile"),
            to: `/u/${user.username}`,
          },
          { icon: <HiCog />, name: t("common:nav_settings"), to: "/settings" },
        ];
        dropdownButton = (
          <img
            src={
              image ||
              "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
            }
            alt="Profile"
            className="h-8 w-8 rounded-full object-cover"
            height="2rem"
            width="2rem"
          />
        );
        navigation = [
          ...navigation,
          {
            name: t("common:nav_speeddata"),
            to: "/speeddata/own",
            current: route === "speeddata",
          },
          {
            name: t("common:nav_freestyle"),
            to: "/freestyle/own",
            current: route === "freestyle",
          },
          {
            name: t("common:nav_player"),
            to: "/player",
            current: route === "player",
          },
          {
            name: t("common:nav_groups"),
            to: "/group",
            current: route === "group",
          },
        ];
      }
      if (user?.roles?.includes("admin")) {
        bottom = [
          ...bottom,
          {
            name: t("common:nav_admin"),
            to: "/admin",
            icon: <IoAppsOutline />,
            current: route.match(new RegExp("admin(.*)")),
          },
        ];
      }
      bottom = [
        ...bottom,
        {
          name: t("common:nav_groups"),
          icon: <IoMdPeople />,
          to: "/group",
          current: route === "group",
        },
        {
          name: t("common:nav_speeddata"),
          to: "/speeddata/own",
          icon: <IoIosTimer />,
          current: route === "speeddata",
        },
        {
          name: t("common:nav_freestyle"),
          to: "/freestyle/own",
          icon: <IoIosList />,
          current: route === "freestyle",
        },
        {
          name: t("common:nav_player"),
          to: "/player",
          icon: <IoMusicalNotes />,
          current: route === "player",
        },
        {
          name: t("common:nav_profile"),
          to: `/u/${user.username}`,
          current: route === "profile",
          icon: (
            <img
              src={
                image ||
                "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
              }
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"
              height="2rem"
              width="2rem"
            />
          ),
        },
      ];
      if (route === "profile") {
        action = { name: t("common:nav_settings"), to: "/settings" };
      }
    } else {
      if (isSmall) {
        if (route === "login" || route === "home") {
          action = {
            name: t("common:nav_signup"),
            to: "/register",
          };
        } else {
          action = {
            name: t("common:nav_login"),
            to: "/login",
          };
        }
      } else {
        navigation = [
          ...navigation,
          {
            name: t("common:nav_login"),
            to: "/login",
            current: route === "login",
          },
          {
            name: t("common:nav_signup"),
            to: "/register",
            current: route === "signup",
          },
        ];
      }
    }
    if (!isSmall && user?.roles?.includes("admin")) {
      navigation = [
        ...navigation,
        {
          name: t("common:nav_admin"),
          to: "/admin",
          current: route.match(new RegExp("admin(.*)")),
        },
      ];
    }

    return { navigation, dropdownButton, dropdown, bottom, action };
  }

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      getUserSearch(user.username).then((response) => {
        setImage(response.data.picture ?? "");
      });
    }
  }, [user]);

  function Player() {
    const { position, duration } = useTrackPlayerProgress(250);
    const currentTrack = usePlaybackTrackChanged();
    const playbackState = usePlaybackState();

    const [isModal, setIsModal] = useState(false);

    const breakpoint = useBreakpoint();
    const isSmall = breakpoint === "xs" || breakpoint === "sm";

    useEffect(() => {
      player.setupPlayer({
        capabilities: [
          [
            "play",
            async () => {
              await player.play();
            },
          ],
          [
            "pause",
            () => {
              player.pause();
            },
          ],
          [
            "previoustrack",
            async () => {
              await player.skipToPrevious();
            },
          ],
          [
            "nexttrack",
            async () => {
              await player.skipToNext();
            },
          ],
          [
            "stop",
            () => {
              player.reset();
            },
          ],
        ],
      });
      player.setVolume(1);
    }, []);

    async function playOrPause() {
      if (playbackState === "STATE_PAUSED") {
        player.play();
        return;
      }
      if (playbackState === "STATE_PLAYING") {
        player.pause();
        return;
      }
      player.play();
    }

    if (!currentTrack) {
      return <Outlet />;
    }

    if (isModal) {
      return (
        <div
          className={classNames(
            "fixed right-0 bottom-0 top-0 left-0 z-50 flex items-end justify-center" +
              " bg-black/25 p-4 backdrop-blur xs:pointer-events-none xs:justify-end xs:bg-transparent" +
              " xs:backdrop-blur-none"
          )}
        >
          <div
            className={classNames(
              "pointer-events-auto h-fit max-w-sm grow overflow-hidden rounded-xl bg-white text-black" +
                " dark:bg-black dark:text-white",
              isSmall ? "mb-16" : ""
            )}
          >
            <div className="flex h-auto flex-col items-center bg-gray-500/50 p-4 sm:py-2">
              <div className="flex w-full justify-between">
                <span
                  className="cursor-pointer p-2 sm:p-1"
                  onClick={() => {
                    player.reset();
                  }}
                >
                  <IoIosSquare className="text-2xl" />
                </span>
                <span
                  className="cursor-pointer p-2 sm:p-1"
                  onClick={() => {
                    setIsModal(false);
                  }}
                >
                  <FaAngleDown className="text-2xl" />
                </span>
              </div>
              <div
                className={classNames(
                  "flex h-full flex-col items-center sm:flex-row sm:space-x-4"
                )}
              >
                <div className="flex shrink items-center justify-center">
                  <img
                    src={PlaceholderMusic}
                    alt="track-artwork"
                    className="w-full rounded-lg sm:max-h-48"
                  />
                </div>
                <div className="flex w-full flex-col items-center p-2 pb-3 sm:p-0 sm:pb-0">
                  <div className="flex w-full shrink grow flex-col py-2">
                    <span className="pb-2 text-xl leading-none">
                      {currentTrack?.title}
                    </span>
                    <span className="leading-none opacity-75">
                      {currentTrack?.artist}
                    </span>
                  </div>
                  <div className="my-8 h-1 w-full bg-gray-500/50 sm:my-4">
                    <div
                      className="flex h-1 justify-end bg-white"
                      style={{
                        width: `${
                          duration && position ? (position / duration) * 100 : 0
                        }%`,
                      }}
                    >
                      <FaCircle className="-mt-[0.35rem] -mr-[0.35rem]" />
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-center">
                    <div
                      onClick={() => {
                        player.skipToPrevious();
                      }}
                      className="cursor-pointer p-2"
                    >
                      <IoIosSkipBackward className="text-4xl sm:text-2xl" />
                    </div>
                    <div onClick={playOrPause} className="cursor-pointer p-2">
                      {playbackState === "STATE_PLAYING" ? (
                        <IoIosPause className="text-8xl sm:text-4xl" />
                      ) : (
                        <IoIosPlay className="text-8xl sm:text-4xl" />
                      )}
                    </div>
                    <div
                      onClick={() => {
                        player.skipToNext();
                      }}
                      className="cursor-pointer p-2"
                    >
                      <IoIosSkipForward className="text-4xl sm:text-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed bottom-4 right-4 left-4 z-40 flex justify-center xs:justify-end">
        <div
          className={classNames(
            "max-w-sm grow cursor-pointer overflow-hidden rounded-xl bg-white text-black dark:bg-black dark:text-white",
            isSmall ? "mb-16" : ""
          )}
          onClick={() => {
            setIsModal(true);
          }}
        >
          <div
            className={classNames(
              "relative flex h-[4.25rem] flex-col items-center bg-gray-500/50"
            )}
          >
            <div className="flex h-[4.25rem] w-full items-center p-2 pb-3">
              <img
                src={PlaceholderMusic}
                alt="track-artwork"
                className="h-full rounded-lg"
              />
              <div className="flex min-w-0 shrink grow flex-col px-2">
                <span className="truncate pb-1 text-lg leading-none">
                  {currentTrack?.title}
                </span>
                <span className="truncate text-sm leading-none opacity-75">
                  {currentTrack?.artist}
                </span>
              </div>
              <div
                onClick={async (e) => {
                  e.stopPropagation();
                  await playOrPause();
                }}
                className="cursor-pointer p-2"
              >
                {playbackState === "STATE_PLAYING" ? (
                  <IoIosPause className="text-2xl" />
                ) : (
                  <IoIosPlay className="text-2xl" />
                )}
              </div>
            </div>
            <div className="absolute bottom-0 h-1 w-full bg-gray-500/50">
              <div
                className="h-1 bg-white"
                style={{
                  width: `${
                    duration && position ? (position / duration) * 100 : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gray-100 pb-12 dark:bg-gray-900">
      <Player />
      <Navbar
        bottom={getNavData().bottom}
        navigation={getNavData().navigation}
        dropdown={getNavData().dropdown}
        dropdownButton={getNavData().dropdownButton}
        action={getNavData().action}
      />
      <div className="flex h-full w-full grow flex-col md:flex-row">
        {user?.roles?.includes("admin") &&
          route.match(new RegExp("admin(.*)")) && <AdminNav />}
        <div className="min-w-0 grow rounded-tl-3xl bg-white p-4 text-black dark:bg-black dark:text-white sm:p-8">
          <div className="mb-auto flex flex-col space-y-8">
            <Alert />
            {children}
          </div>
        </div>
      </div>
      <FooterNav
        social={[
          {
            link: "https://instagram.com/myJumpData",
            icon: <FaInstagram />,
            name: "Instagram",
          },
        ]}
        links={[
          {
            heading: t("common:nav_trust_legal"),
            links: [
              {
                name: t("common:nav_terms"),
                to: "/terms",
              },
              {
                name: t("common:nav_legal"),
                to: "/legal",
              },
            ],
          },
        ]}
      />
    </div>
  );
}
