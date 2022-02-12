import { Menu, Transition } from "@headlessui/react";
import { classNames } from "@myjumpdata/utils";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { HiDotsVertical, HiPlus } from "react-icons/hi";
import { TextInput } from "../components/Input";

export function SpeedDataInput({
  id,
  name,
  score,
  onSubmit,
  dropdown,
}: {
  id: string;
  name: string;
  score: string;
  onSubmit: any;
  dropdown?: any[];
}) {
  const { t } = useTranslation();
  return (
    <div className="border-t border-gray-300 dark:border-gray-700 py-2">
      <div className="flex justify-between space-x-2 -mb-4">
        <div className="flex items-center">
          <label className="text-xl font-bold leading-none" htmlFor={id}>
            {name}
          </label>
          {dropdown && (
            <Menu as="div" className="relative ml-2">
              <div className="inset-y-0 ring-0 flex items-center">
                <Menu.Button className="focus:ring-white dark:focus:ring-offset-white focus:ring-offset-gray-800 dark:focus:ring-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full h-8 w-8 flex items-center justify-center">
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
                <Menu.Items className="absolute origin-top max-w-48 rounded-md shadow-lg py-1 bg-white text-gray-800 dark:bg-black dark:text-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none z-20 border border-gray-500/50">
                  {dropdown.map((e: any) => (
                    <Menu.Item key={e.name}>
                      {({ active }) => (
                        <span
                          className={classNames(
                            active && "bg-gray-100 dark:bg-gray-900",
                            "flex items-center justify-start px-4 py-2 text-sm leading-none cursor-pointer"
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
        <span className="text-xs whitespace-nowrap uppercase leading-none">
          {t("common:high")}: {score}
        </span>
      </div>
      <form onSubmit={onSubmit}>
        <input type="hidden" name="id" value={id} />
        <div className="flex items-center space-x-2">
          <TextInput type="number" inline min="0" inputName={id} />
          <button
            className="h-10 w-10 bg-yellow-500 dark:bg-yellow-700 flex justify-center items-center text-xl rounded"
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
