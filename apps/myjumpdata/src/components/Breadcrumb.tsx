import { useTranslation } from "react-i18next";
import { HiChevronRight, HiHome, HiOutlineHome } from "react-icons/hi";
import { useEffect, useState } from "react";
import i18next from "i18next";

export default function Breadcrumb({
  data,
  setState,
}: {
  data: any[];
  setState: any;
}) {
  const { t, i18n } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    i18next.loadNamespaces("freestyle").then(() => {
      setLoaded(true);
    });
  }, []);

  return (
    <div className="flex h-full flex-wrap items-center space-x-2 rounded-xl bg-gray-500/50 px-4 py-2">
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
  );
}
