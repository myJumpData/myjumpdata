import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import useBreakpoint from "../hooks/useBreakpoint";

export default function FooterNav({ social, links }) {
  const { t } = useTranslation();

  const breakpoint = useBreakpoint();
  const isSmall = breakpoint === "xs" || breakpoint === "sm";

  return (
    <footer
      className={classNames(
        "py-8 px-4 text-gray-600 dark:text-gray-400 sm:px-8 lg:px-12",
        { "mb-16": isSmall },
        { "mb-8": !isSmall }
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col space-y-4 border-b border-gray-600 py-4 dark:border-gray-400 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="flex shrink-0 flex-col space-y-4">
          <div className="text-4xl">
            <Link to="/">
              <img
                className="h-8 w-auto scale-150 saturate-0"
                src={Logo}
                alt="myJumpData"
                height="2rem"
                width="2rem"
              />
            </Link>
          </div>
          <div className="text-sm">
            <p>{t<string>("common:footer_text")}</p>
          </div>
          <div className="flex space-x-2 text-lg">
            {social.map(({ link, icon, name }) => (
              <a
                aria-label={name}
                key={link}
                href={link}
                className="hover:text-gray-600 dark:hover:text-gray-400"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
        <div className="flex w-full flex-wrap sm:justify-center">
          {links &&
            links.map(({ heading, links }) => (
              <div key={heading} className="m<-4 flex min-w-[10rem] flex-col">
                <span className="mb-2 text-lg">{heading}</span>
                <div className="flex flex-col text-sm">
                  {links.map(({ name, to }) => (
                    <Link
                      key={name}
                      to={to}
                      className="py-2 hover:text-gray-600 dark:hover:text-gray-400"
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl justify-start py-4 text-sm sm:justify-center">
        &copy; myJumpData {new Date().getFullYear()} &middot; All rights
        reserved.
      </div>
    </footer>
  );
}
