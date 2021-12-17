type CardProps = {
  children: any;
  design:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "light"
    | "dark";
};

export default function Card({children, design}: CardProps) {
  let className: string = "";
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
  }
  return (
    <div className={className + " w-full py-2 px-4 my-2 rounded shadow"}>
      {children}
    </div>
  );
}
