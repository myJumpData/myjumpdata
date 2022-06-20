import classNames from "classnames";

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

export default function Button({ onClick, name, design, type }: ButtonProps) {
  let className;
  switch (design) {
    case "primary":
      className =
        "bg-blue-500 text-white dark:bg-transparent dark:outline-blue-500 dark:hover:bg-blue-700";
      break;
    case "secondary":
      className =
        "bg-gray-500 text-white dark:bg-transparent dark:outline-gray-500 dark:hover:bg-gray-700";
      break;
    case "success":
      className =
        "bg-green-500 text-white dark:bg-transparent dark:outline-green-500 dark:hover:bg-green-700";
      break;
    case "danger":
      className =
        "bg-red-500 text-white dark:bg-transparent dark:outline-red-500 dark:hover:bg-red-700";
      break;
    case "warning":
      className =
        "bg-yellow-500 text-white dark:bg-transparent dark:outline-yellow-500 dark:hover:bg-yellow-700";
      break;
    case "light":
      className =
        "bg-gray-200 text-black dark:bg-transparent dark:outline-gray-200 dark:hover:bg-gray-400";
      break;
    case "dark":
      className =
        "bg-gray-900 text-white dark:bg-transparent dark:outline-gray-900 dark:hover:bg-gray-700";
      break;
    case "link":
      className =
        "bg-gray-100 text-blue-500 text-sm dark:bg-transparent dark:outline-gray-100 dark:hover:bg-gray-300";
      break;
    default:
      className =
        "bg-blue-500 text-white dark:bg-transparent dark:outline-blue-500 dark:hover:bg-blue-700";
  }
  return (
    <button
      onClick={onClick}
      type={type}
      className={classNames(
        className,
        "my-2 h-8 w-full rounded shadow outline-none dark:shadow-none dark:outline-1"
      )}
    >
      {name}
    </button>
  );
}
