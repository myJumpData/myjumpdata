import { getUserSearch } from "@myjumpdata/service";
import { lazy, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaInstagram } from "react-icons/fa";
import { HiCog, HiUser } from "react-icons/hi";
import { useSelector } from "react-redux";
import FooterNav from "../components/FooterNav";
import Navbar from "../components/Navbar";
import Alert from "./Alert";

const AdminNav = lazy(() => import("./AdminNav"));

export default function Wrapper({ children }: { children: ReactNode }) {
  const user = useSelector((state: any) => state.user);
  const route = useSelector((state: any) => state.route);
  const { t } = useTranslation();

  const [image, setImage] = useState("");
  let dropdown;
  let dropdownButton;
  let navigation: any[] = [
    {
      name: t("common:nav_home"),
      to: "/",
      current: route === "home",
    },
  ];
  if (Object.keys(user).length !== 0) {
    dropdown = [
      {
        icon: <HiUser />,
        name: t("common:nav_profile"),
        to: `/u/${user.username}`,
      },
      { icon: <HiCog />, name: t("common:nav_settings"), to: "/settings" },
    ];
    dropdownButton =
      image === "" ? (
        <HiUser className="h-8 w-8 rounded-full bg-gray-200 p-1.5 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700" />
      ) : (
        <img
          src={image}
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
        name: t("common:nav_groups"),
        to: "/group",
        current: route === "group",
      },
    ];
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
        current: route === "register",
      },
    ];
  }
  if (user?.roles?.includes("admin")) {
    navigation = [
      ...navigation,
      {
        name: t("common:nav_admin"),
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
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gray-100 dark:bg-gray-900">
      <Navbar
        navigation={navigation}
        dropdown={dropdown}
        dropdownButton={dropdownButton}
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
