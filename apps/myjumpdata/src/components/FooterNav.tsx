import { useTranslation } from 'react-i18next';
import { GiSkippingRope } from 'react-icons/gi';
import { Link } from 'react-router-dom';

export default function FooterNav({ social, links }) {
  const { t } = useTranslation();

  return (
    <footer className="py-8 text-gray-400 dark:text-gray-600 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 py-4 border-b border-gray-400 dark:border-gray-600">
        <div className="flex shrink-0 flex-col space-y-4">
          <div className="text-4xl">
            <GiSkippingRope />
          </div>
          <div className="text-sm">
            <p>{t('common:footer.text')}</p>
          </div>
          <div className="flex space-x-2 text-lg">
            {social.map(({ link, icon }) => (
              <a
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
              <div
                key={heading}
                className="min-w-[10rem] flex flex-col my-4 sm:my-4"
              >
                <span className="text-lg">{heading}</span>
                <ul className="text-sm flex flex-col space-y-2">
                  {links.map(({ name, to }) => (
                    <li key={name}>
                      <Link
                        to={to}
                        className="hover:text-gray-600 dark:hover:text-gray-400"
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
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
