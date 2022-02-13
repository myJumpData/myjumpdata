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
        <p className="tracking-loose w-full">{t("main:jumbotron_top")}</p>
        <h1 className="my-4 w-full text-2xl font-bold leading-tight lg:text-4xl">
          {t("main:jumbotron_title")}
        </h1>
        <p className="mb-8 w-full text-xl leading-normal lg:text-2xl">
          {t("main:jumbotron_bottom")}
        </p>

        <Link
          to="/register"
          className="rounded-full bg-yellow-500 py-2 px-4 font-bold text-gray-800 shadow-lg hover:underline md:py-4 md:px-8"
        >
          {t("common:nav_signup")}
        </Link>
      </div>
    );
  }

  function BySkippersForSkippers() {
    return (
      <div>
        <div className="mb-2 w-full space-y-2">
          <span className="text-xl font-bold">{t("main:by_title")}</span>
        </div>
        <div className="flex flex-col items-center justify-center sm:flex-row">
          <div className="max-w-xs sm:w-2/5 md:w-1/5">
            <img src={markofediv} alt="Marko Fediv" className="rounded-full" />
          </div>
          <div className="mt-8 ml-0 max-w-prose text-center sm:ml-8 sm:mt-0 sm:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400 lg:text-lg">
              {t("main:by_position")}
            </p>
            <div className="text-xl font-bold lg:text-4xl">Marko Fediv</div>
            <p className="mb-6 text-base lg:text-xl">
              <Trans i18nKey="main:by_text">
                {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                <a
                  href="https://tg-hanau.de/rope-skipping/ueber-uns"
                  className="text-yellow-600 hover:text-yellow-900"
                  rel="noreferrer"
                  target="_blank"
                />
              </Trans>
            </p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://marko.fediv.me"
              className="rounded-full bg-yellow-500 py-2 px-4 font-bold text-black shadow-lg hover:underline lg:py-4 lg:px-8"
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
            "mb-8 flex flex-wrap items-center " +
            (swap && "sm:flex-row-reverse")
          }
        >
          <div className="mb-4 w-full px-0 sm:mb-0 sm:w-1/3 sm:px-4">
            <img src={img} alt="" />
          </div>
          <div className="w-full sm:w-2/3">
            <span className="mb-3 text-xl font-bold leading-none lg:text-2xl">
              {heading}
            </span>
            <p className="mb-8 text-base text-gray-600 dark:text-gray-400">
              {children}
            </p>
            {link && (
              <a
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-yellow-500 py-2 px-4 font-bold text-black shadow-lg hover:underline lg:py-4 lg:px-8"
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
        <div className="mb-2 w-full space-y-2">
          <span className="text-xl font-bold">
            {t("main:open_development_title")}
          </span>
        </div>

        <Part
          img={undraw_work_in_progress}
          heading={t("main:open_development_work_in_progress_title")}
        >
          {t("main:open_development_work_in_progress_text")}
        </Part>
        <Part
          img={undraw_code_review}
          heading={t("main:open_development_open_source_title")}
          link="GitHub"
          to="https://github.com/myJumpData"
          swap
        >
          {t("main:open_development_open_source_text")}
        </Part>
        <Part
          img={undraw_collaborators}
          heading={t("main:open_development_user_focused_title")}
          link="myJumpData@gmail.com"
          to="mailto:myjumpdata@gmail.com"
        >
          {t("main:open_development_user_focused_text")}
        </Part>
      </div>
    );
  }

  function Action() {
    return (
      <div>
        <div className="mb-2 w-full space-y-2">
          <span className="text-xl font-bold">{t("main:cta_title")}</span>
        </div>
        <span className="my-4 leading-tight">{t("main:cta_text")}</span>
        <div className="py-6">
          <Link
            to="/register"
            className="mx-auto my-6 rounded-full bg-yellow-500 py-2 px-4 font-bold text-gray-800 shadow-lg hover:underline lg:mx-0 lg:py-4 lg:px-8"
          >
            {t("common:nav_signup")}
          </Link>
        </div>
      </div>
    );
  }
}
