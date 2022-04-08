import { saveFreestyleData, saveFreestyleDataOwn } from "@myjumpdata/service";
import { classNames } from "@myjumpdata/utils";
import { useTranslation } from "react-i18next";
import { FaRegCheckSquare, FaRegSquare, FaSquare } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";

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
  onRefresh?: () => void;
  user: "own" | string;
}) {
  const { i18n, t } = useTranslation();
  return (
    <div
      className={classNames(
        "relative flex cursor-pointer items-center justify-between rounded-lg border p-2 hover:bg-gray-500/50 ",
        name
          .split("_")
          .map((item) => i18n.exists(`freestyle:${item}`))
          .some((item) => item === false) && "border border-red-500"
      )}
      onClick={() => {
        if (onRefresh !== undefined) {
          if (user === "own") {
            saveFreestyleDataOwn(id as string, !element?.stateUser).then(() => {
              onRefresh();
            });
          } else {
            saveFreestyleData(user, id as string, !element?.stateCoach).then(
              () => {
                onRefresh();
              }
            );
          }
        }
      }}
    >
      <span className="break-word overflow-hidden overflow-ellipsis text-sm xs:text-base">
        {compiled
          ? name
              .split("_")
              .map((item) => t<string>(`freestyle:${item}`))
              .join(" ")
          : t<string>(`freestyle:${name}`)}
      </span>
      <div className="flex flex-col xs:flex-row">
        {level && (
          <span className="absolute top-0 right-2 whitespace-nowrap text-[0.6rem] opacity-80 xs:text-xs">
            Lvl. {level}
          </span>
        )}
        {element && (
          <span className="ml-2 self-end py-2 xs:self-center xs:text-2xl">
            {element?.stateCoach ? (
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
export function Folder({ name, onClick }: { name: string; onClick: any }) {
  const { t } = useTranslation();
  return (
    <div
      className={
        "flex cursor-pointer items-center break-words rounded-xl border-2 border-gray-500 p-4 font-bold shadow sm:text-lg md:text-xl"
      }
      onClick={() => {
        onClick(name);
      }}
    >
      <span className="truncate">
        {t<string>(`freestyle:${name.split("_")[name.split("_").length - 1]}`)}
      </span>
    </div>
  );
}
