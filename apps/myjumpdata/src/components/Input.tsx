import { Listbox, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiCheck, HiSelector } from 'react-icons/hi';
import classNames from '../helper/classNames';

type TextInputProps = {
  name?: string;
  type: 'email' | 'password' | 'text' | 'number';
  value?: string;
  stateChange?: any;
  inline?: boolean;
  min?: number | string | undefined;
  inputName?: string;
};

/**
 * Input Types
 *
 * TODO: "button"
 * TODO: "checkbox"
 * TODO: "color"
 * TODO: "date"
 * TODO: "datetime-local"
 * * "email"
 * TODO: "file"
 * TODO: "hidden"
 * TODO: "image"
 * TODO: "month"
 * * "number"
 * * "password"
 * TODO: "radio"
 * TODO: "range"
 * TODO: "reset"
 * TODO: "search"
 * TODO: "submit"
 * TODO: "tel"
 * * "text"
 * TODO: "time"
 * TODO: "url"
 * TODO: "week";
 */

export function TextInput({
  name,
  type,
  value,
  stateChange,
  inline,
  min,
  inputName,
}: TextInputProps) {
  let inlineClass = ' mb-4 ';
  if (inline) {
    inlineClass = '';
  }
  const [passwordShown, setPasswordShown] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPasswordShown(false);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [passwordShown]);

  return (
    <div className="w-full relative py-2">
      <input
        type={
          type === 'password' ? (passwordShown ? 'text' : 'password') : type
        }
        value={value}
        onChange={(e) => stateChange && stateChange(e.target.value)}
        className={
          'peer h-10 w-full border-b-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-yellow-500 placeholder-transparent transition bg-transparent  ' +
          inlineClass
        }
        min={min}
        name={inputName}
        placeholder={name}
      />
      {name && (
        <label
          htmlFor={inputName}
          className="absolute left-0 -top-2 text-gray-600 dark:text-gray-300 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 transition-all pointer-events-none"
        >
          {name}
        </label>
      )}
      {type === 'password' && (
        <span
          onClick={() => {
            setPasswordShown(!passwordShown);
          }}
          className="absolute top-6 right-4"
        >
          {passwordShown ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
    </div>
  );
}

type SelectInputProps = {
  options: SelectOptionProps[];
  stateChange: any;
  current: any;
};
type SelectOptionProps = {
  name: string | number | undefined;
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
        <Listbox.Button
          className={classNames(
            'relative w-full py-2 pl-3 pr-10 text-left rounded-lg cursor-default sm:text-sm',
            'border border-gray-200 dark:border-gray-500',
            'bg-transparent',
            'focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2',
            'focus:ring-2 focus:ring-transparent focus:ring-offset-orange-300 focus:ring-offset-2'
          )}
        >
          <span className="block truncate">
            {
              options.find((e) => {
                return e.value === current;
              })?.name
            }
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <HiSelector className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white dark:bg-black rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20">
            {options.map((e: SelectOptionProps, i) => (
              <Listbox.Option
                key={i}
                className={({ active }) =>
                  classNames(
                    active
                      ? 'text-dark dark:text-white bg-yellow-100 dark:bg-yellow-900'
                      : 'text-gray-900 dark:text-gray-100',
                    'cursor-default select-none relative py-2 pl-10 pr-4'
                  )
                }
                value={e.value}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`${
                        selected ? 'font-medium' : 'font-normal'
                      } block truncate`}
                    >
                      {e.name}
                    </span>
                    {selected ? (
                      <span
                        className={classNames(
                          'text-yellow-500 absolute inset-y-0 left-0 flex items-center pl-3'
                        )}
                      >
                        <HiCheck className="w-5 h-5" aria-hidden="true" />
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
