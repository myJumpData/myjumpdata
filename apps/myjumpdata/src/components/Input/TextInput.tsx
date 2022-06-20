import classNames from "classnames";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type TextInputProps = {
  name?: string;
  type: "email" | "password" | "text" | "number";
  value?: string;
  stateChange?: any;
  inline?: boolean;
  min?: number | string | undefined;
  inputName?: string;
  valid?: boolean | undefined;
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
  valid,
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

  // noinspection PointlessBooleanExpressionJS
  return (
    <div className="relative w-full py-2">
      <input
        type={
          type === "password" ? (passwordShown ? "text" : "password") : type
        }
        value={value}
        onChange={(e) => stateChange && stateChange(e.target.value)}
        className={classNames(
          "peer h-10 w-full border-b-2 border-gray-300 bg-transparent placeholder-transparent transition focus:border-yellow-500 focus:outline-none dark:border-gray-700",
          inlineClass,
          valid === true
            ? "text-green-500"
            : valid === false
            ? "text-red-500"
            : "text-gray-900 dark:text-gray-100"
        )}
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
