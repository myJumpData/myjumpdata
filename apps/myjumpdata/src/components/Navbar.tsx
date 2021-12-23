import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Fragment, ReactElement } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Logo from '../assets/skipping-rope.png';
import classNames from '../helper/classNames';

export default function Navbar({
  navigation,
  dropdown,
  dropdownButton,
}: {
  navigation: { name: string; to: string; current: boolean }[];
  dropdown?: { icon: ReactElement; name: string; to: string }[];
  dropdownButton?: ReactElement;
}) {
  return (
    <div className="pb-16">
      <Disclosure
        as="nav"
        className="fixed bg-gray-100 dark:bg-gray-900 w-full z-20"
      >
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
              <div className="relative flex items-center justify-between h-16">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    {open ? (
                      <HiX className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <HiMenu className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex-shrink-0 flex items-center">
                    <Link to="/">
                      <img className="h-8 w-auto" src={Logo} alt="myJumpData" />
                    </Link>
                  </div>
                  <div className="hidden sm:block sm:ml-6">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.to}
                          className={classNames(
                            item.current
                              ? 'bg-gray-300/50 text-black dark:bg-gray-500/50 hover:bg-gray-300/75 dark:hover:bg-gray-500/75 dark:text-white'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-300/30 hover:text-gray-800 dark:hover:bg-gray-500/30 dark:hover:text-gray-100',
                            'px-3 py-2 rounded-md text-sm font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                {dropdownButton && dropdown && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      <div className="inset-y-0 ring-0 flex items-center">
                        <Menu.Button className="focus:ring-white dark:focus:ring-offset-white focus:ring-offset-gray-800 dark:focus:ring-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full">
                          {dropdownButton}
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 max-w-48 rounded-md shadow-lg py-1 bg-white text-gray-800 dark:bg-black dark:text-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {dropdown.map((e) => (
                            <Menu.Item key={e.name}>
                              {({ active }) => (
                                <Link
                                  to={e.to}
                                  className={classNames(
                                    active && 'bg-gray-100 dark:bg-gray-900',
                                    'flex items-center justify-start px-4 py-2 text-sm leading-none'
                                  )}
                                >
                                  <span className="mr-2 text-base">
                                    {e.icon}
                                  </span>
                                  <span>{e.name}</span>
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                )}
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.to}
                    className={classNames(
                      item.current
                        ? 'bg-gray-300/50 text-black dark:bg-gray-500/50 hover:bg-gray-300/75 dark:hover:bg-gray-500/75 dark:text-white'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-300/30 hover:text-gray-800 dark:hover:bg-gray-500/30 dark:hover:text-gray-100',
                      'block px-3 py-2 rounded-md text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
