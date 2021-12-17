type AlertProps = {
  design:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "light"
    | "dark";
  text: string;
};

export default function Alert({design, text}: AlertProps) {
  let className: string = "";
  if (design === "primary") {
    className = "bg-blue-500 text-blue-900 border-blue-600";
  } else if (design === "secondary") {
    className = "bg-gray-500 text-black border-gray-600";
  } else if (design === "success") {
    className = "bg-green-500 text-green-900 border-green-600";
  } else if (design === "danger") {
    className = "bg-red-500 text-red-900 border-red-600";
  } else if (design === "warning") {
    className = "bg-yellow-500 text-yellow-900 border-yellow-600";
  } else if (design === "light") {
    className = "bg-gray-200 text-black border-gray-300";
  } else if (design === "dark") {
    className = "bg-gray-900 text-white border-gray-800";
  }
  return (
    <div
      className={
        className + " text-sm w-full py-2 px-4 rounded my-2 border shadow"
      }
    >
      {text}
    </div>
  );
}
