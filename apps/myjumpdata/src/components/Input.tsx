import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
          'peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-500 placeholder-transparent transition  ' +
          inlineClass
        }
        min={min}
        name={inputName}
        placeholder={name}
      />
      {name && (
        <label
          htmlFor={inputName}
          className="absolute left-0 -top-2 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 transition-all pointer-events-none"
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
  let inlineClass = 'mb-4';
  if (inline) {
    inlineClass = '';
  }
  return (
    <div className="w-full">
      <select
        className={
          'block w-full border border-gray-300 rounded py-1 px-2 ' + inlineClass
        }
        onChange={(e) => stateChange && stateChange(e.target.value)}
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
