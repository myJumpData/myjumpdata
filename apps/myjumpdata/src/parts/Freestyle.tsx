import { saveFreestyleDataOwn } from "@myjumpdata/service";
import { classNames } from "@myjumpdata/utils";
import { useTranslation } from "react-i18next";
import { FaRegCheckSquare, FaRegSquare, FaSquare } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";

export function Back({ to, state }: { to: string; state: any }) {
  const { t } = useTranslation();
  return (
    <div
      className="p-4 rounded-xl shadow break-words items-center flex font-bold sm:text-lg md:text-xl cursor-pointer bg-gray-500/50"
      onClick={() => {
        state(to);
      }}
    >
      <HiArrowLeft className="mr-2 text-xl" />
      {t("common:action.back")}
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
}: {
  id?: string;
  name: string;
  level?: string;
  compiled?: boolean;
  element?: { stateUser?: boolean; stateCoach?: boolean };
  onRefresh: () => void;
}) {
  const { i18n, t } = useTranslation();
  return (
    <div
      className={classNames(
        "flex justify-between items-center border rounded-lg p-2 cursor-pointer hover:bg-gray-500/50 relative ",
        name
          .split("_")
          .map((item) => i18n.exists(`freestyle:${item}`))
          .some((item) => item === false) && "border border-red-500"
      )}
      onClick={() => {
        saveFreestyleDataOwn(id as string, !element?.stateUser).then(() => {
          onRefresh();
        });
      }}
    >
      <span className="break-word overflow-hidden overflow-ellipsis text-sm xs:text-base">
        {compiled
          ? name
              .split("_")
              .map((item) => t(`freestyle:${item}`))
              .join(" ")
          : t(`freestyle:${name}`)}
      </span>
      <div className="flex flex-col xs:flex-row">
        {level && (
          <span className="text-[0.6rem] xs:text-xs opacity-80 whitespace-nowrap absolute top-0 right-2">
            Lvl. {level}
          </span>
        )}
        <span className="xs:text-2xl self-end xs:self-center ml-2 py-2">
          {element?.stateCoach ? (
            <FaSquare />
          ) : element?.stateUser ? (
            <FaRegCheckSquare />
          ) : (
            <FaRegSquare />
          )}
        </span>
      </div>
    </div>
  );
}
export function Folder({ name, onClick }: { name: string; onClick: any }) {
  const { t } = useTranslation();
  return (
    <div
      className={
        "p-4 rounded-xl shadow break-words items-center flex font-bold sm:text-lg md:text-xl cursor-pointer border-2 border-gray-500"
      }
      onClick={() => {
        onClick(name);
      }}
    >
      <span className="truncate">
        {t(`freestyle:${name.split("_")[name.split("_").length - 1]}`)}
      </span>
    </div>
  );
}
