import {useTranslation} from "react-i18next";
import {FaCog, FaDumbbell, FaHome, FaUser, FaUsers} from "react-icons/fa";
import {BottomNav} from "../components/BottomNav";
import Nav from "../components/Nav";
import AuthService from "../services/auth.service";
import {MainNav} from "./MainNav";

export function ScreenNav({
                            name,
                            icon,
                            back,
                            button,
                          }: {
  name: string;
  icon?: any;
  back?: boolean;
  button?: any;
}) {
  const {currentUser} = AuthService.getCurrentUser();
  const {t} = useTranslation();
  if (currentUser) {
    return (
      <>
        <Nav
          brand={name}
          icon={icon}
          back={back}
          tabs={[
            {name: t("common:nav.home"), to: "/home", icon: <FaHome/>},
            {name: t("common:nav.train"), to: "/train", icon: <FaDumbbell/>},
            {name: t("common:nav.groups"), to: "/group", icon: <FaUsers/>},
          ]}
          dropdown={[
            {
              icon: <FaUser/>,
              name: t("common:nav.profile"),
              to: `/u/${currentUser.username}`,
            },
            {icon: <FaCog/>, name: "Settings", to: "/settings"},
          ]}
          button={button}
        />
        <BottomNav
          tabs={[
            {name: t("common:nav.home"), to: "/home", icon: <FaHome/>},
            {name: t("common:nav.train"), to: "/train", icon: <FaDumbbell/>},
            {name: t("common:nav.groups"), to: "/group", icon: <FaUsers/>},
            {
              icon: <FaUser/>,
              name: t("common:nav.profile"),
              to: `/u/${currentUser.username}`,
            },
          ]}
        />
      </>
    );
  } else {
    return <MainNav/>;
  }
}
