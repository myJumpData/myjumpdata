import { classNames } from "@myjumpdata/utils";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function AdminNav() {
  const route = useSelector((state: any) => state.route);

  const adminRoutes = [
    { name: "home", current: route === "admin/home" },
    { name: "users", current: route === "admin/users" },
    { name: "groups", current: route === "admin/groups" },
    { name: "freestyle", current: route === "admin/freestyle" },
    { name: "localization", current: route === "admin/localization" },
  ];

  return (
    <div className="text-black dark:text-white min-w-[10rem]  pl-2">
      <div className="flex flex-row md:flex-col">
        <Link to="/admin" className="py-2 px-4 font-bold text-lg">
          admin
        </Link>
        <div className="flex flex-row md:flex-col overflow-y-auto">
          {adminRoutes.map((item: any) => (
            <Link
              key={item.name}
              to={`/admin/${item.name}`}
              className={classNames(
                "py-2 px-4 rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl",
                item.current && "bg-white dark:bg-black"
              )}
            >
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
