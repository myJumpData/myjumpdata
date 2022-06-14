import i18next from "i18next";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import { setRoute } from "../redux/route.action";

export default function MainScreen() {
  useEffect(() => {
    setRoute("home");
    i18next.loadNamespaces("main").then(() => {
      setLoaded(true);
    });
  }, []);

  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col space-y-12">
      <div className="mx-auto w-full max-w-screen-md">
        <div className="flex flex-col items-center sm:flex-row">
          <h1 className="my-8 shrink-0 grow text-2xl font-bold leading-loose lg:text-4xl">
            <Trans i18nKey="main:header">
              <br />
              <br />
            </Trans>
          </h1>
          <img
            className="max-h-[16rem] w-full max-w-[16rem] shrink rounded-[25%] bg-gray-500/50"
            src={Logo}
            alt="myJumpData"
            height="2rem"
            width="2rem"
          />
        </div>
        <p className="my-8 text-center text-lg sm:max-w-[30ch] sm:text-left">
          {t<string>("main:header_text")}
        </p>
        <div className="my-8 flex justify-center sm:justify-start">
          <a href="https://play.google.com/store/apps/details?id=me.fediv.myjumpdata&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
            <img
              className="h-16"
              alt="Get it on Google Play"
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            />
          </a>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-screen-lg flex-col flex-wrap sm:flex-row">
        <div className="p-2 sm:w-1/2">
          <div className="h-full cursor-pointer rounded-lg bg-gray-500/25 py-8 px-8 text-center transition hover:bg-gray-500/50">
            <h1 className="my-8 text-2xl font-bold leading-loose lg:text-4xl">
              {t<string>("common:nav_speeddata")}
            </h1>
            <p className="my-8 text-lg">{t<string>("main:speeddata_text")}</p>
          </div>
        </div>
        <div className="p-2 sm:w-1/2">
          <div className="h-full cursor-pointer rounded-lg bg-gray-500/25 py-8 px-8 text-center transition hover:bg-gray-500/50">
            <h1 className="my-8 text-2xl font-bold leading-loose lg:text-4xl">
              {t<string>("common:nav_freestyle")}
            </h1>
            <p className="my-8 text-lg">{t<string>("main:freestyle_text")}</p>
          </div>
        </div>
        <div className="p-2 sm:w-1/2">
          <div className="h-full cursor-pointer rounded-lg bg-gray-500/25 py-8 px-8 text-center transition hover:bg-gray-500/50">
            <h1 className="my-8 text-2xl font-bold leading-loose lg:text-4xl">
              {t<string>("common:nav_player")}
            </h1>
            <p className="my-8 text-lg">{t<string>("main:player_text")}</p>
          </div>
        </div>
        <div className="p-2 sm:w-1/2">
          <div className="h-full cursor-pointer rounded-lg bg-gray-500/25 py-8 px-8 text-center transition hover:bg-gray-500/50">
            <h1 className="my-8 text-2xl font-bold leading-loose lg:text-4xl">
              {t<string>("common:nav_groups")}
            </h1>
            <p className="my-8 text-lg">{t<string>("main:groups_text")}</p>
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-screen-lg flex-col sm:flex-row"></div>
    </div>
  );
}
