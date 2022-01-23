import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.svg";

export default function FooterNav({ social, links }) {
  const { t } = useTranslation();

  return (
    <footer className="py-8 text-gray-600 dark:text-gray-400 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 py-4 border-b border-gray-600 dark:border-gray-400">
        <div className="flex shrink-0 flex-col space-y-4">
          <div className="text-4xl">
            <Link to="/">
              <img
                className="h-8 scale-150 w-auto saturate-0"
                src={Logo}
                alt="myJumpData"
              />
            </Link>
          </div>
          <div className="text-sm">
            <p>{t("common:footer.text")}</p>
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
        <div className="flex flex-wrap sm:justify-center w-full">
          {links &&
            links.map(({ heading, links }) => (
              <div key={heading} className="min-w-[10rem] flex flex-col m<-4">
                <span className="text-lg mb-2">{heading}</span>
                <div className="text-sm flex flex-col">
                  {links.map(({ name, to }) => (
                    <Link
                      key={name}
                      to={to}
                      className="hover:text-gray-600 dark:hover:text-gray-400 py-2"
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex py-4 justify-start sm:justify-center text-sm">
        &copy; myJumpData &middot; All rights reserved.
      </div>
    </footer>
  );
}
