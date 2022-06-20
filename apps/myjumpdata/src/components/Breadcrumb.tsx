import classNames from "classnames";
import i18next from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  HiArrowLeft,
  HiChevronRight,
  HiHome,
  HiOutlineHome,
  HiRefresh,
} from "react-icons/hi";

export default function Breadcrumb({
  data,
  setState,
  refresh,
  isRefreshing,
}: {
  data: any[];
  setState: any;
  refresh?: any;
  isRefreshing?: any;
}) {
  const { t, i18n } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    i18next.loadNamespaces("freestyle").then(() => {
      setLoaded(true);
    });
  }, []);

  return (
    <div className="flex h-full items-center space-x-2 rounded-xl bg-gray-500/50">
      <div className="flex items-center space-x-2 px-4 py-2">
        <span
          className="cursor-pointer"
          onClick={() => {
            const d = [...data];
            d.pop();
            setState(d.join("_"));
          }}
        >
          <HiArrowLeft
            className={classNames(
              "text-2xl transition-opacity",
              { "opacity-100": data.length > 0 },
              { "opacity-50": !(data.length > 0) }
            )}
          />
        </span>
        {refresh ? (
          <span
            className={classNames("cursor-pointer", {
              "animate-spin-reverse": isRefreshing,
            })}
            onClick={refresh}
          >
            <HiRefresh className="text-2xl" />
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center space-x-2 border-l-2 border-gray-500/50 px-4 py-2">
        <span
          onClick={() => {
            setState("");
          }}
          className="cursor-pointer text-xl"
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
                {loaded
                  ? i18n.exists(`freestyle:${e}`)
                    ? t(`freestyle:${e}`)
                    : e
                  : ""}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
