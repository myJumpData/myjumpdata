import {useTranslation} from "react-i18next";
import {GiSkippingRope} from "react-icons/gi";
import Nav from "../components/Nav";
import AuthService from "../services/auth.service";

export function MainNav({page}: { page?: "login" | "register" | undefined }) {
  const {currentUser} = AuthService.getCurrentUser();
  const {t} = useTranslation();
  if (currentUser) {
    return (
      <Nav
        brand="myJumpData"
        icon={<GiSkippingRope className="h-8 inline fill-current"/>}
        action={t("common:interact.open")}
        actionTo="/home"
      />
    );
  } else {
    return (
      <>
        <div className="hidden sm:block">
          <Nav
            brand="myJumpData"
            icon={<GiSkippingRope className="h-8 inline fill-current"/>}
            action={t("common:entry.signup")}
            actionTo="/register"
            other={[{name: t("common:entry.login"), to: "/login"}]}
          />
        </div>
        <div className="sm:hidden block">
          <Nav
            brand="myJumpData"
            icon={<GiSkippingRope className="h-8 inline fill-current"/>}
            action={
              page === "register"
                ? t("common:entry.login")
                : t("common:entry.signup")
            }
            actionTo={page === "register" ? "/login" : "/register"}
          />
        </div>
      </>
    );
  }
}
