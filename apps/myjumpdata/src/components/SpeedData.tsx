import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { HiDotsVertical, HiPlus } from "react-icons/hi";
import { IoIosMusicalNotes } from "react-icons/io";
import { TextInput } from "./Input";

export function SpeedDataInput({
  id,
  name,
  score,
  onSubmit,
  dropdown,
  music,
}: {
  id: string;
  name: string;
  score: string;
  onSubmit: any;
  dropdown?: any[];
  music?: any[];
}) {
  const { t } = useTranslation();
  return (
    <div className="border-t border-gray-300 py-2 dark:border-gray-700">
      <div className="-mb-4 flex justify-between space-x-2">
        <div className="flex items-center">
          <label className="text-xl font-bold leading-none" htmlFor={id}>
            {name}
          </label>
          {dropdown && (
            <Menu as="div" className="relative ml-2">
              <div className="inset-y-0 flex items-center ring-0">
                <Menu.Button
                  className="flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-gray-800 dark:focus:ring-offset-white"
                  aria-label="more-action"
                >
                  <HiDotsVertical />
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
                <Menu.Items className="max-w-48 absolute z-20 origin-top rounded-md border border-gray-500/50 bg-white py-1 text-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black dark:text-gray-200">
                  {dropdown.map((e: any) => (
                    <Menu.Item key={e.name}>
                      {({ active }) => (
                        <span
                          className={classNames(
                            { "bg-gray-100 dark:bg-gray-900": active },
                            "flex cursor-pointer items-center justify-start px-4 py-2 text-sm leading-none"
                          )}
                          {...e.props}
                        >
                          <span className="whitespace-nowrap">{e.name}</span>
                        </span>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          )}
          {music && (
            <Menu as="div" className="relative ml-2">
              <div className="inset-y-0 flex items-center ring-0">
                <Menu.Button
                  className="flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-gray-800 dark:focus:ring-offset-white"
                  aria-label="more-action"
                >
                  <IoIosMusicalNotes />
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
                <Menu.Items className="max-w-48 absolute z-20 origin-top rounded-md border border-gray-500/50 bg-white py-1 text-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black dark:text-gray-200">
                  {music.map((e: any) => (
                    <Menu.Item key={e.name}>
                      {({ active }) => (
                        <span
                          className={classNames(
                            { "bg-gray-100 dark:bg-gray-900": active },
                            "flex cursor-pointer items-center justify-start px-4 py-2 text-sm leading-none"
                          )}
                          {...e.props}
                        >
                          <span className="whitespace-nowrap">{e.name}</span>
                        </span>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>
        <span className="whitespace-nowrap text-xs uppercase leading-none">
          {t<string>("common:high")}: {score}
        </span>
      </div>
      <form onSubmit={onSubmit}>
        <input type="hidden" name="id" value={id} />
        <div className="flex items-center space-x-2">
          <TextInput type="number" inline min="0" inputName={id} />
          <button
            className="flex h-10 w-10 items-center justify-center rounded bg-yellow-500 text-xl dark:bg-yellow-700"
            type="submit"
            aria-label="submit"
          >
            <HiPlus />
          </button>
        </div>
      </form>
    </div>
  );
}
