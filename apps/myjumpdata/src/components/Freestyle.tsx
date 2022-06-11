import { useTranslation } from "react-i18next";
import { FaRegCheckSquare, FaRegSquare, FaSquare } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";
import {
  saveFreestyleData,
  saveFreestyleDataOwn,
} from "../service/freestyle.service";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import i18next from "i18next";

export function Back({ to, state }: { to: string; state: any }) {
  const { t } = useTranslation();
  return (
    <div
      className="flex cursor-pointer items-center break-words rounded-xl bg-gray-500/50 p-4 font-bold shadow sm:text-lg md:text-xl"
      onClick={() => {
        state(to);
      }}
    >
      <HiArrowLeft className="mr-2 text-xl" />
      {t<string>("common:back")}
    </div>
  );
}
export function Element({
  id,
  name,
  level,
  compiled,
  element,
  onRefresh,
  user,
}: {
  id?: string;
  name: string;
  level?: string;
  compiled?: boolean;
  element?: { stateUser?: boolean; stateCoach?: boolean };
  onRefresh?: any;
  user: "own" | string;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    i18next.loadNamespaces("freestyle").then(() => {
      setLoaded(true);
    });
  }, []);

  const [reloading, setReloading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="relative flex cursor-pointer items-center justify-between rounded-lg border p-2 hover:bg-gray-500/50"
      onClick={() => {
        if (reloading || !loaded) {
          return;
        }
        if (onRefresh !== undefined) {
          if (user === "own") {
            setReloading(true);
            saveFreestyleDataOwn(id as string, !element?.stateUser).then(() => {
              onRefresh().then(() => {
                setReloading(false);
              });
            });
          } else {
            setReloading(true);
            saveFreestyleData(user, id as string, !element?.stateCoach).then(
              () => {
                onRefresh().then(() => {
                  setReloading(false);
                });
              }
            );
          }
        }
      }}
    >
      <span className="break-word overflow-hidden overflow-ellipsis text-sm xs:text-base">
        {loaded
          ? compiled
            ? name
                .split("_")
                .map((item) => t<string>(`freestyle:${item}`))
                .join(" ")
            : t<string>(`freestyle:${name}`)
          : ""}
      </span>
      <div className="flex flex-col xs:flex-row">
        {level && (
          <span className="absolute top-0 right-2 whitespace-nowrap text-[0.6rem] opacity-80 xs:text-xs">
            Lvl. {level}
          </span>
        )}
        {element && (
          <span className="ml-2 self-end py-2 xs:self-center xs:text-2xl">
            {reloading ? (
              <Spinner />
            ) : element?.stateCoach ? (
              <FaSquare />
            ) : element?.stateUser ? (
              <FaRegCheckSquare />
            ) : (
              <FaRegSquare />
            )}
          </span>
        )}
      </div>
    </div>
  );
}
export function Folder({
  name,
  onClick,
  set,
}: {
  name: string;
  onClick: any;
  set?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div
      className={
        "flex cursor-pointer items-center break-words rounded-xl border-2 border-gray-500 p-4 font-bold shadow" +
        " relative" +
        " sm:text-lg md:text-xl"
      }
      onClick={() => {
        onClick(name);
      }}
    >
      {set ? (
        <span className="absolute top-0 right-0 rounded-2xl bg-gray-500/50 px-[.5rem] py-[.25rem] text-[.75rem] leading-none">
          Set
        </span>
      ) : null}
      <span className="truncate">
        {t<string>(`freestyle:${name.split("_").at(-1)}`)}
      </span>
    </div>
  );
}
