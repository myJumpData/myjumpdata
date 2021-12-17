import {useEffect, useState} from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";

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
  let inlineClass = "mb-4";
  if (inline) {
    inlineClass = "";
  }
  let onChange: any = () => {
  };
  if (stateChange) {
    onChange = (e: any) => {
      stateChange(e.target.value);
    };
  }
  const [passwordShown, setPasswordShown] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPasswordShown(false);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [passwordShown]);

  return (
    <div className="w-full relative">
      {name && <span>{name}</span>}
      <input
        type={
          type === "password" ? (passwordShown ? "text" : "password") : type
        }
        value={value}
        onChange={onChange}
        className={
          "block w-full rounded border border-gray-300 py-1 px-2 " + inlineClass
        }
        min={min}
        name={inputName}
      />
      {type === "password" && (
        <span
          onClick={() => {
            setPasswordShown(!passwordShown);
          }}
          className="absolute top-8 right-4"
        >
          {passwordShown ? <FaEyeSlash/> : <FaEye/>}
        </span>
      )}
    </div>
  );
}

type SelectInputProps = {
  options: any | SelectOptionProps;
  inline?: boolean;
  stateChange?: any;
};
type SelectOptionProps = {
  name: string | number | undefined;
  value: string | number | undefined;
};

export function SelectInput({
                              options,
                              inline,
                              stateChange,
                            }: SelectInputProps) {
  let inlineClass = "mb-4";
  if (inline) {
    inlineClass = "";
  }
  let onChange: any = () => {
  };
  if (stateChange) {
    onChange = (e: any) => {
      stateChange(e.target.value);
    };
  }
  return (
    <div className="w-full">
      <select
        className={
          "block w-full border border-gray-300 rounded py-1 px-2 " + inlineClass
        }
        onChange={onChange}
      >
        {options.map((option: SelectOptionProps) => (
          <option value={option.value} key={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
