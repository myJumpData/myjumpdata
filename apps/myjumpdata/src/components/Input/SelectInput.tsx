import { Listbox, Transition } from "@headlessui/react";
import classNames from "classnames";
import { Fragment, ReactNode } from "react";
import { HiCheck, HiSelector } from "react-icons/hi";

type SelectInputProps = {
  options: SelectOptionProps[];
  stateChange: any;
  current: any;
};
type SelectOptionProps = {
  name: string | number | undefined | ReactNode;
  value: string | number | undefined;
};

export function SelectInput({
  options,
  stateChange,
  current,
}: SelectInputProps) {
  return (
    <Listbox value={current} onChange={stateChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-default rounded-lg border border-gray-200 bg-transparent py-2 pl-3 pr-10 text-left focus:ring-2 focus:ring-transparent focus:ring-offset-2 focus:ring-offset-orange-300 focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:border-gray-500 sm:text-sm">
          <span className="block truncate">
            {
              options.find((e) => {
                return e.value === current;
              })?.name
            }
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <HiSelector className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black sm:text-sm">
            {options.map((e: SelectOptionProps, i) => (
              <Listbox.Option
                key={i}
                className={({ active }) =>
                  classNames(
                    {
                      "text-dark bg-yellow-100 dark:bg-yellow-900 dark:text-white":
                        active,
                    },
                    { "text-gray-900 dark:text-gray-100": !active },
                    "relative cursor-default select-none py-2 pl-10 pr-4"
                  )
                }
                value={e.value}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`${
                        selected ? "font-medium" : "font-normal"
                      } block truncate`}
                    >
                      {e.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-yellow-500">
                        <HiCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
