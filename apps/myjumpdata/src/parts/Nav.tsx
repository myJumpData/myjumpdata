import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiCog, HiUser } from "react-icons/hi";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { getUserSearch } from "../services/user.service.";

export function Nav({
  current,
}: {
  current: "login" | "register" | "home" | "speeddata" | "group" | string;
}) {
  const { t } = useTranslation();

  const user = useSelector((state: any) => state.user);
  const [image, setImage] = useState("");
  let dropdown;
  let dropdownButton;
  let navigation;
  if (Object.keys(user).length !== 0) {
    dropdown = [
      {
        icon: <HiUser />,
        name: t("common:nav.profile"),
        to: `/u/${user.username}`,
      },
      { icon: <HiCog />, name: t("common:nav:settings"), to: "/settings" },
    ];
    dropdownButton =
      image === "" ? (
        <HiUser className="h-8 w-8 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 p-1.5 rounded-full" />
      ) : (
        <img
          src={image}
          alt="Profile"
          className="object-cover h-8 w-8 rounded-full"
        />
      );
    navigation = [
      {
        name: t("common:nav.home"),
        to: "/",
        current: current === "home",
      },
      {
        name: t("common:nav.speeddata"),
        to: "/speeddata/own",
        current: current === "speeddata",
      },
      {
        name: t("common:nav.groups"),
        to: "/group",
        current: current === "group",
      },
    ];
    if (process.env.NODE_ENV === "development") {
      navigation = [
        {
          name: t("common:nav.home"),
          to: "/",
          current: current === "home",
        },
        {
          name: t("common:nav.speeddata"),
          to: "/speeddata/own",
          current: current === "speeddata",
        },
        {
          name: t("common:nav.freestyle"),
          to: "/freestyle",
          current: current === "freestyle",
        },
        {
          name: t("common:nav.groups"),
          to: "/group",
          current: current === "group",
        },
      ];
    }
  } else {
    navigation = [
      {
        name: t("common:nav.home"),
        to: "/",
        current: current === "home",
      },
      {
        name: t("common:entry.login"),
        to: "/login",
        current: current === "login",
      },
      {
        name: t("common:entry.signup"),
        to: "/register",
        current: current === "register",
      },
    ];
  }

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      getUserSearch(user.username).then((response) => {
        if (response.data?.picture) {
          fetch(response.data.picture).then((r) => {
            if (r.status === 200) {
              setImage(response.data.picture);
            }
          });
        }
      });
    }
  }, [user]);

  return (
    <Navbar
      navigation={navigation}
      dropdown={dropdown}
      dropdownButton={dropdownButton}
    />
  );
}
