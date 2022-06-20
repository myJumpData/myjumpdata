import classNames from "classnames";
import { useEffect, useState } from "react";
import { HiCheckCircle, HiPencil, HiXCircle } from "react-icons/hi";

export function TextInputInline({
  value,
  inputName,
  onSubmit,
  onChange,
  valid,
}: {
  value: string;
  inputName: string;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (value: string) => void;
  onChange?: any;
  valid?: boolean | undefined;
}) {
  const [valueHold, setValueHold] = useState(value);

  useEffect(() => {
    setValueHold(value);
  }, [value]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={valueHold}
        onChange={(e) => {
          onChange && onChange(e.target.value);
          setValueHold(e.target.value);
        }}
        className={classNames(
          "peer w-full border-b border-black bg-transparent focus:border-gray-500/50 focus:outline-0",
          (() => {
            if (valid === true && value !== valueHold) {
              return "text-green-500";
            }
            if (valid === false) {
              return "text-red-500";
            }
            return "text-gray-900 dark:text-gray-100";
          })()
        )}
        name={inputName}
        id={inputName}
      />
      {value === valueHold ? (
        <span className="pointer-events-none absolute top-0 right-0 cursor-pointer text-xl text-gray-500 peer-focus:opacity-0">
          <HiPencil />
        </span>
      ) : (
        <>
          <span
            className="absolute top-0 right-5 cursor-pointer text-xl text-gray-500 hover:text-red-500"
            onClick={() => {
              onChange && onChange(value);
              setValueHold(value);
            }}
          >
            <HiXCircle />
          </span>
          <span
            className="absolute top-0 right-0 cursor-pointer text-xl text-gray-500 hover:text-green-500"
            onClick={() => {
              onSubmit(valueHold);
            }}
          >
            <HiCheckCircle />
          </span>
        </>
      )}
    </div>
  );
}
