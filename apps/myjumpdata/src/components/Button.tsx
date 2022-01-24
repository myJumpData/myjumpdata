import { classNames } from "@myjumpdata/utils";

type ButtonProps = {
  onClick?: any;
  name: string;
  design:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "light"
    | "dark"
    | "link";
  type?: "button" | "submit" | "reset";
};
type ButtonIconProps = {
  onClick?: any;
  design:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "light"
    | "dark"
    | "link";
  type?: "button" | "submit" | "reset";
  component: any;
};

export default function Button({ onClick, name, design, type }: ButtonProps) {
  let className = "";
  if (design === "primary") {
    className =
      "bg-blue-500 text-white dark:bg-transparent dark:outline-blue-500 dark:hover:bg-blue-700";
  } else if (design === "secondary") {
    className =
      "bg-gray-500 text-white dark:bg-transparent dark:outline-gray-500 dark:hover:bg-gray-700";
  } else if (design === "success") {
    className =
      "bg-green-500 text-white dark:bg-transparent dark:outline-green-500 dark:hover:bg-green-700";
  } else if (design === "danger") {
    className =
      "bg-red-500 text-white dark:bg-transparent dark:outline-red-500 dark:hover:bg-red-700";
  } else if (design === "warning") {
    className =
      "bg-yellow-500 text-white dark:bg-transparent dark:outline-yellow-500 dark:hover:bg-yellow-700";
  } else if (design === "light") {
    className =
      "bg-gray-200 text-black dark:bg-transparent dark:outline-gray-200 dark:hover:bg-gray-400";
  } else if (design === "dark") {
    className =
      "bg-gray-900 text-white dark:bg-transparent dark:outline-gray-900 dark:hover:bg-gray-700";
  } else if (design === "link") {
    className =
      "bg-gray-100 text-blue-500 text-sm dark:bg-transparent dark:outline-gray-100 dark:hover:bg-gray-300";
  }
  return (
    <button
      onClick={onClick}
      type={type}
      className={classNames(
        className,
        "w-full rounded shadow dark:shadow-none h-8 outline-none dark:outline-1 my-2"
      )}
    >
      {name}
    </button>
  );
}

export function ButtonIcon({
  onClick,
  component,
  design,
  type,
}: ButtonIconProps) {
  let className = "";
  if (design === "primary") {
    className = "bg-blue-500 text-white";
  } else if (design === "secondary") {
    className = "bg-gray-500 text-white";
  } else if (design === "success") {
    className = "bg-green-500 text-white";
  } else if (design === "danger") {
    className = "bg-red-500 text-white";
  } else if (design === "warning") {
    className = "bg-yellow-500 text-white";
  } else if (design === "light") {
    className = "bg-gray-200 text-black";
  } else if (design === "dark") {
    className = "bg-gray-900 text-white";
  } else if (design === "link") {
    className = "bg-gray-100 text-blue-500 text-sm";
  }
  return (
    <button
      onClick={onClick}
      type={type}
      className={
        className + " h-10 w-10 flex justify-center items-center rounded shadow"
      }
    >
      {component}
    </button>
  );
}
