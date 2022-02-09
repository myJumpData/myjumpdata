import { useTranslation } from "react-i18next";
import { HiChevronRight, HiHome, HiOutlineHome } from "react-icons/hi";

export default function Breadcrumb({
  data,
  setState,
}: {
  data: any[];
  setState: any;
}) {
  const { t, i18n } = useTranslation();
  return (
    <div className="flex h-full items-center bg-gray-200 dark:bg-gray-700 rounded-xl px-4 space-x-2 py-2 flex-wrap">
      <span
        onClick={() => {
          setState("");
        }}
        className="text-xl cursor-pointer"
      >
        {data.length < 1 ? <HiHome /> : <HiOutlineHome />}
      </span>

      {data.map((e, index, array) => {
        let last = false;
        if (index + 1 === array.length) {
          last = true;
        }
        return (
          <span
            className="inline-flex cursor-pointer"
            key={index}
            onClick={() => {
              setState(data.splice(0, index + 1).join("_"));
            }}
          >
            <HiChevronRight className="text-2xl" />
            <span className={"whitespace-nowrap " + (last && "font-bold")}>
              {i18n.exists(`freestyle:${e}`) ? t(`freestyle:${e}`) : e}
            </span>
          </span>
        );
      })}
    </div>
  );
}
