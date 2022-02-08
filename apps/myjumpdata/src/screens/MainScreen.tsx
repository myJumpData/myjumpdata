import { setRoute } from "@myjumpdata/redux";
import { useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import markofediv from "../assets/markofediv.jpg";
import undraw_code_review from "../assets/undraw_code_review_re_woeb.svg";
import undraw_collaborators from "../assets/undraw_collaborators_re_hont.svg";
import undraw_work_in_progress from "../assets/undraw_work_in_progress_uhmv.svg";

export default function MainScreen() {
  useEffect(() => {
    setRoute("home");
  }, []);

  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-12">
      <Jumbotron />
      <BySkippersForSkippers />
      <OpenDevelopment />
      <Action />
    </div>
  );

  function Jumbotron() {
    return (
      <div>
        <p className="tracking-loose w-full">{t("main:jumbotron.top")}</p>
        <h1 className="my-4 lg:text-4xl text-2xl font-bold leading-tight w-full">
          {t("main:jumbotron.title")}
        </h1>
        <p className="leading-normal lg:text-2xl text-xl mb-8 w-full">
          {t("main:jumbotron.bottom")}
        </p>

        <Link
          to="/register"
          className="hover:underline text-gray-800 bg-yellow-500 font-bold rounded-full md:py-4 md:px-8 py-2 px-4 shadow-lg"
        >
          {t("common:entry:signup")}
        </Link>
      </div>
    );
  }

  function BySkippersForSkippers() {
    return (
      <div>
        <div className="w-full space-y-2 mb-2">
          <span className="font-bold text-xl">{t("main:by.title")}</span>
        </div>
        <div className="flex items-center flex-col sm:flex-row justify-center">
          <div className="md:w-1/5 sm:w-2/5 max-w-xs">
            <img src={markofediv} alt="Marko Fediv" className="rounded-full" />
          </div>
          <div className="mt-8 ml-0 sm:ml-8 sm:mt-0 text-center sm:text-left max-w-prose">
            <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-lg">
              {t("main:by.position")}
            </p>
            <div className="font-bold text-xl lg:text-4xl">Marko Fediv</div>
            <p className="text-base lg:text-xl mb-6">
              <Trans i18nKey="main:by.text">
                {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                <a
                  href="https://tg-hanau.de/rope-skipping/ueber-uns"
                  className="hover:text-yellow-900 text-yellow-600"
                  rel="noreferrer"
                  target="_blank"
                />
              </Trans>
            </p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://marko.fediv.me"
              className="hover:underline bg-yellow-500 text-black font-bold rounded-full py-2 px-4 lg:py-4 lg:px-8 shadow-lg"
            >
              marko.fediv.me
            </a>
          </div>
        </div>
      </div>
    );
  }

  function OpenDevelopment() {
    function Part({
      img,
      heading,
      children,
      link,
      to,
      swap,
    }: {
      img?: any;
      heading: string;
      children?: any;
      link?: any;
      to?: any;
      swap?: boolean;
    }) {
      return (
        <div
          className={
            "flex flex-wrap items-center mb-8 " +
            (swap && "sm:flex-row-reverse")
          }
        >
          <div className="w-full sm:w-1/3 mb-4 sm:mb-0 px-0 sm:px-4">
            <img src={img} alt="" />
          </div>
          <div className="w-full sm:w-2/3">
            <h3 className="text-xl lg:text-2xl font-bold leading-none mb-3">
              {heading}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-base">
              {children}
            </p>
            {link && (
              <a
                target="_blank"
                rel="noreferrer"
                className="hover:underline bg-yellow-500 text-black font-bold rounded-full py-2 px-4 lg:py-4 lg:px-8 shadow-lg"
                href={to}
              >
                {link}
              </a>
            )}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="w-full space-y-2 mb-2">
          <span className="font-bold text-xl">
            {t("main:open_development.title")}
          </span>
        </div>

        <Part
          img={undraw_work_in_progress}
          heading={t("main:open_development.work_in_progress.title")}
        >
          {t("main:open_development.work_in_progress.text")}
        </Part>
        <Part
          img={undraw_code_review}
          heading={t("main:open_development.open_source.title")}
          link="GitHub"
          to="https://github.com/myJumpData"
          swap
        >
          {t("main:open_development.open_source.text")}
        </Part>
        <Part
          img={undraw_collaborators}
          heading={t("main:open_development.user_focused.title")}
          link="myJumpData@gmail.com"
          to="mailto:myjumpdata@gmail.com"
        >
          {t("main:open_development.user_focused.text")}
        </Part>
      </div>
    );
  }

  function Action() {
    return (
      <div>
        <div className="w-full space-y-2 mb-2">
          <span className="font-bold text-xl">{t("main:cta.title")}</span>
        </div>
        <h3 className="my-4 leading-tight">{t("main:cta.text")}</h3>
        <div className="py-6">
          <Link
            to="/register"
            className="mx-auto lg:mx-0 hover:underline bg-yellow-500 font-bold rounded-full my-6 py-2 px-4 lg:py-4 lg:px-8 shadow-lg text-gray-800"
          >
            {t("common:entry.signup")}
          </Link>
        </div>
      </div>
    );
  }
}
