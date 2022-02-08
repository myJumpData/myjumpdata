import { getUserSearch } from "@myjumpdata/service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiCog, HiUser } from "react-icons/hi";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";

export function Nav() {
  const { t } = useTranslation();

  const user = useSelector((state: any) => state.user);
  const route = useSelector((state: any) => state.route);

  const [image, setImage] = useState("");
  let dropdown;
  let dropdownButton;
  let navigation: any[] = [
    {
      name: t("common:nav.home"),
      to: "/",
      current: route === "home",
    },
  ];
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
      ...navigation,
      {
        name: t("common:nav.speeddata"),
        to: "/speeddata/own",
        current: route === "speeddata",
      },
      {
        name: t("common:nav.freestyle"),
        to: "/freestyle/own",
        current: route === "freestyle",
      },
      {
        name: t("common:nav.groups"),
        to: "/group",
        current: route === "group",
      },
    ];
  } else {
    navigation = [
      ...navigation,
      {
        name: t("common:entry.login"),
        to: "/login",
        current: route === "login",
      },
      {
        name: t("common:entry.signup"),
        to: "/register",
        current: route === "register",
      },
    ];
  }
  if (user?.roles?.includes("admin")) {
    navigation = [
      ...navigation,
      {
        name: t("common:nav.admin"),
        to: "/admin",
        current: route.match(new RegExp("admin(.*)")),
      },
    ];
  }

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      getUserSearch(user.username).then((response) => {
        if (response.data?.picture) {
          fetch(response.data.picture)
            .then((r) => {
              if (r.status === 200) {
                setImage(response.data.picture);
              }
            })
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            .catch(() => {});
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
