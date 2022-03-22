import { useState } from "react";
import { HiCheckCircle, HiPencil, HiXCircle } from "react-icons/hi";

export function TextInputInline({
  value,
  inputName,
  onSubmit,
}: {
  value: string;
  inputName: string;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (value: string) => void;
}) {
  const [valueHold, setValueHold] = useState(value);
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={valueHold}
        onChange={(e) => {
          setValueHold(e.target.value);
        }}
        className="peer w-full border-b border-black bg-transparent focus:border-gray-500/50 focus:outline-0"
        name={inputName}
        id={inputName}
      />
      {value !== valueHold ? (
        <>
          <span
            className="absolute top-0 right-5 cursor-pointer text-xl text-gray-500 hover:text-red-500"
            onClick={() => {
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
      ) : (
        <span className="pointer-events-none absolute top-0 right-0 cursor-pointer text-xl text-gray-500 peer-focus:opacity-0">
          <HiPencil />
        </span>
      )}
    </div>
  );
}
