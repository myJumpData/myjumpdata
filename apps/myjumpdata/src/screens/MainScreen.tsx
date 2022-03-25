import { setRoute } from "@myjumpdata/redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Logo from "../assets/Logo.svg";

export default function MainScreen() {
  useEffect(() => {
    setRoute("home");
  }, []);

  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-12">
      <div className="mx-auto w-full max-w-screen-md flex-row sm:flex">
        <div className="sm:w-1/2">
          <h1 className="my-8 text-2xl font-bold leading-loose lg:text-4xl">
            Einfach. Digital. <br /> Rope Skipping
            <br /> Orientierte App
          </h1>
          <p className="my-8 text-lg">
            Mit myJumpData ist eine Verfolgung und Auswertung der Sportler,
            digital und einfach. Über die Webseite oder über die App.
          </p>
          <div className="my-8 flex">
            <a href="https://play.google.com/store/apps/details?id=me.fediv.myjumpdata&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
              <img
                className="h-16"
                alt="Get it on Google Play"
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              />
            </a>
          </div>
        </div>
        <div className="hidden items-center justify-center p-4 sm:flex sm:w-1/2 sm:p-16">
          <img
            className="w-full rounded-[25%] bg-gray-500/50"
            src={Logo}
            alt="myJumpData"
            height="2rem"
            width="2rem"
          />
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-screen-lg flex-col flex-wrap sm:flex-row">
        <div className="p-2 sm:w-1/2">
          <div className="h-full cursor-pointer rounded-lg bg-gray-500/25 py-8 px-8 text-center transition hover:bg-gray-500/50">
            <h1 className="my-8 text-2xl font-bold leading-loose lg:text-4xl">
              {t("common:nav_speeddata")}
            </h1>
            <p className="my-8 text-lg">
              Erfasse und überblicke deine Leistung in Speed.
            </p>
          </div>
        </div>
        <div className="p-2 sm:w-1/2">
          <div className="h-full cursor-pointer rounded-lg bg-gray-500/25 py-8 px-8 text-center transition hover:bg-gray-500/50">
            <h1 className="my-8 text-2xl font-bold leading-loose lg:text-4xl">
              {t("common:nav_freestyle")}
            </h1>
            <p className="my-8 text-lg">
              Erfasse welche Sprünge du kannst und welche du noch lernen kannst.
            </p>
          </div>
        </div>
        <div className="p-2 sm:w-1/2">
          <div className="h-full cursor-pointer rounded-lg bg-gray-500/25 py-8 px-8 text-center transition hover:bg-gray-500/50">
            <h1 className="my-8 text-2xl font-bold leading-loose lg:text-4xl">
              {t("common:nav_player")}
            </h1>
            <p className="my-8 text-lg">
              Spiele die Time-Tracks direkt aus der App ab.
            </p>
          </div>
        </div>
        <div className="p-2 sm:w-1/2">
          <div className="h-full cursor-pointer rounded-lg bg-gray-500/25 py-8 px-8 text-center transition hover:bg-gray-500/50">
            <h1 className="my-8 text-2xl font-bold leading-loose lg:text-4xl">
              {t("common:nav_groups")}
            </h1>
            <p className="my-8 text-lg">
              Nutze die Gruppen-Funktion um deine Leistungen von einem Trainer
              einzutragen.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-screen-lg flex-col sm:flex-row"></div>
    </div>
  );
}
