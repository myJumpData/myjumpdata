import { useEffect, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

type NavProps = {
  icon: any;
  brand: string;
  action?: string;
  actionTo?: any;
  other?: any | NavOtherProps;
  back?: boolean;
  tabs?: any;
  dropdown?: any;
  button?: any;
};
type NavOtherProps = {
  name: string;
  to: string;
};

export default function Nav({
  icon,
  brand,
  action,
  actionTo,
  other,
  back,
  tabs,
  dropdown,
  button,
}: NavProps) {
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);
  }, []);

  function handleScroll() {
    if (window.scrollY > 10) {
      setScroll(true);
    } else setScroll(false);
  }

  const navigate = useNavigate();

  return (
    <nav
      className={
        'fixed w-full z-30 top-0 transition duration-1000 ease-in-out ' +
        (scroll ? 'text-black bg-white shadow-lg' : 'text-white bg-transparent')
      }
    >
      <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2 px-4">
        <div className="flex items-center">
          {back ? (
            <span
              className={
                'font-bold text-2xl  lg:text-4xl transition duration-1000 ease-in-out ' +
                (scroll ? 'text-black' : 'text-white')
              }
            >
              <span
                className="mr-2"
                onClick={() => {
                  navigate(-1);
                }}
              >
                {icon}
              </span>
              {brand}
            </span>
          ) : (
            <Link
              to="/"
              className={
                'font-bold text-2xl  lg:text-4xl transition duration-1000 ease-in-out ' +
                (scroll ? 'text-black' : 'text-white')
              }
            >
              <span className="mr-2">{icon}</span>
              {brand}
            </Link>
          )}
        </div>

        <div className="flex-grow flex justify-end items-center w-auto mt-0 bg-transparent text-black p-0 z-20">
          {other && (
            <ul className="flex flex-1 items-center justify-end">
              {other.map((element: NavOtherProps) => {
                return (
                  <li className="mr-3 hidden sm:block" key={element.name}>
                    <Link
                      to={element.to}
                      className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
                    >
                      {element.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          {tabs && (
            <ul
              className={
                'flex-1 items-center justify-end hidden md:flex ' +
                (scroll ? 'text-black ' : 'text-white')
              }
            >
              {tabs.map((tab: any) => {
                return (
                  <li className="mr-3" key={tab.name}>
                    <Link
                      className={
                        'w-full justify-center inline-block text-center pt-2 pb-1 transition duration-500 ease-in-out px-2 ' +
                        (scroll
                          ? 'focus:text-yellow-500 hover:text-yellow-500 '
                          : 'focus:text-black hover:text-black ')
                      }
                      to={tab.to}
                    >
                      <span className="inline-block text-3xl">{tab.icon}</span>
                    </Link>
                  </li>
                );
              })}
              {dropdown && (
                <li className="mr-3">
                  <span
                    className={
                      'w-full justify-center inline-block text-center pt-2 pb-1 transition duration-500 ease-in-out px-2 '
                    }
                  >
                    <span className="inline-block text-3xl group">
                      <FaCaretDown />
                      <ul
                        className={
                          'py-2 px-4 shadow-lg absolute z-50 backdrop-filter backdrop-blur-sm rounded-lg bg-opacity-10 text-lg group-hover:inline-block group-focus:inline-block hover:inline-block focus:inline-block hidden transform -translate-x-8 left-auto right-0 ' +
                          (scroll ? 'bg-white ' : 'bg-yellow-500 ')
                        }
                      >
                        {dropdown.map((drop: any) => (
                          <li
                            className={
                              'hover:bg-white bg-opacity-25 rounded-lg transition duration-500 ease-in-out py-2 px-4 w-full text-left' +
                              (scroll
                                ? 'focus:text-yellow-500 hover:text-yellow-500 '
                                : 'focus:text-black hover:text-black ')
                            }
                            key={drop.name}
                          >
                            {drop.to ? (
                              <Link
                                to={drop.to}
                                className="w-full flex items-center justify-start pr-4"
                              >
                                <span className="w-8">{drop?.icon}</span>
                                <span>{drop.name}</span>
                              </Link>
                            ) : (
                              <span
                                onClick={drop.onClick}
                                className="w-full flex items-center justify-start pr-4"
                              >
                                <span className="w-8">{drop?.icon}</span>
                                <span>{drop.name}</span>
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </span>
                  </span>
                </li>
              )}
            </ul>
          )}

          {button && (
            <ul
              className={
                'flex-1 items-center justify-end md:hidden flex ' +
                (scroll ? 'text-black ' : 'text-white')
              }
            >
              {button.map((button: any) => {
                return (
                  <li className="mr-3" key={button.name}>
                    <Link
                      className={
                        'w-full justify-center inline-block text-center pt-2 pb-1 transition duration-500 ease-in-out px-2 ' +
                        (scroll
                          ? 'focus:text-yellow-500 hover:text-yellow-500 '
                          : 'focus:text-black hover:text-black ')
                      }
                      to={button.to}
                    >
                      <span className="inline-block text-3xl">
                        {button.icon}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          {action && (
            <Link
              to={actionTo}
              className={
                'mx-0 hover:underline font-bold rounded-full mt-0 lg:py-4 lg:px-8 py-2 px-4 shadow text-gray-800 transition duration-1000 ease-in-out ' +
                (scroll ? 'bg-yellow-500 ' : 'bg-white')
              }
            >
              {action}
            </Link>
          )}
        </div>
      </div>
      <hr className="border-b border-gray-100 opacity-25 my-0 py-0" />
    </nav>
  );
}
