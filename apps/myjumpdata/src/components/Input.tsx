import { Listbox, Transition } from "@headlessui/react";
import { classNames } from "@myjumpdata/utils";
import {
  createElement,
  forwardRef,
  Fragment,
  useEffect,
  useState,
} from "react";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  HiCheck,
  HiChevronDown,
  HiChevronLeft,
  HiChevronRight,
  HiSelector,
} from "react-icons/hi";

type TextInputProps = {
  name?: string;
  type: "email" | "password" | "text" | "number";
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
  let inlineClass = " mb-4 ";
  if (inline) {
    inlineClass = "";
  }
  const [passwordShown, setPasswordShown] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPasswordShown(false);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [passwordShown]);

  return (
    <div className="relative w-full py-2">
      <input
        type={
          type === "password" ? (passwordShown ? "text" : "password") : type
        }
        value={value}
        onChange={(e) => stateChange && stateChange(e.target.value)}
        className={
          "peer h-10 w-full border-b-2 border-gray-300 bg-transparent text-gray-900 placeholder-transparent transition focus:border-yellow-500 focus:outline-none dark:border-gray-700 dark:text-gray-100  " +
          inlineClass
        }
        min={min}
        name={inputName}
        id={inputName}
        placeholder={name}
      />
      {name && (
        <label
          htmlFor={inputName}
          className="pointer-events-none absolute left-0 -top-2 text-sm text-gray-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:text-gray-300"
        >
          {name}
        </label>
      )}
      {type === "password" && (
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

export function DateInput({
  setDate,
  date,
}: {
  // eslint-disable-next-line no-unused-vars
  setDate: (d: Date) => void;
  date: Date;
}) {
  const { t, i18n } = useTranslation();
  const customInput = forwardRef(({ value, onClick }: any, ref: any) => {
    const i18n_lang = i18n.language;
    const options: any = {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const selected = new Date(value).toLocaleDateString(i18n_lang, options);
    let text = selected;
    const input = new Date(value).setHours(0, 0, 0, 0);
    if (input === new Date().setHours(0, 0, 0, 0)) {
      text = `${t("common:today")} (${selected})`;
    }
    return (
      <button
        className="flex w-full flex-row items-center justify-between"
        onClick={onClick}
        ref={ref}
      >
        <span className="truncate">{text}</span>
        <HiChevronDown />
      </button>
    );
  });
  return (
    <div>
      <DatePicker
        selected={date}
        onChange={(d: Date) => {
          setDate(d);
        }}
        closeOnScroll
        fixedHeight
        customInput={createElement(customInput)}
        calendarStartDay={1}
        todayButton={t("common:today")}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }: any) => (
          <div className="m-2 flex justify-around">
            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
              <HiChevronLeft />
            </button>
            <span>
              {(() => {
                const d = new Date(date);
                d.setDate(1);
                d.setHours(0, 0, 0, 0);
                return d.toLocaleDateString(i18n.language, {
                  month: "long",
                });
              })()}
            </span>
            <span>
              {(() => {
                const d = new Date(date);
                d.setDate(1);
                d.setHours(0, 0, 0, 0);
                return d.toLocaleDateString(i18n.language, {
                  year: "numeric",
                });
              })()}
            </span>
            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
              <HiChevronRight />
            </button>
          </div>
        )}
      />
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
            "relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left sm:text-sm",
            "border border-gray-200 dark:border-gray-500",
            "bg-transparent",
            "focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300",
            "focus:ring-2 focus:ring-transparent focus:ring-offset-2 focus:ring-offset-orange-300"
          )}
        >
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
                    active
                      ? "text-dark bg-yellow-100 dark:bg-yellow-900 dark:text-white"
                      : "text-gray-900 dark:text-gray-100",
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
                      <span
                        className={classNames(
                          "absolute inset-y-0 left-0 flex items-center pl-3 text-yellow-500"
                        )}
                      >
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
