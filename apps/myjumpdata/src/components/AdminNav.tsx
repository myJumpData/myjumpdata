import { classNames } from "@myjumpdata/utils";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function AdminNav() {
  const route = useSelector((state: any) => state.route);

  const adminRoutes = [
    { name: "home", current: route.match(new RegExp("admin/home(.*)")) },
    { name: "users", current: route.match(new RegExp("admin/users(.*)")) },
    { name: "groups", current: route.match(new RegExp("admin/groups(.*)")) },
    {
      name: "freestyle",
      current: route.match(new RegExp("admin/freestyle(.*)")),
    },
    {
      name: "localization",
      current: route.match(new RegExp("admin/localization(.*)")),
    },
  ];

  return (
    <div className="min-w-[10rem] pl-2 text-black  dark:text-white">
      <div className="flex flex-row md:flex-col">
        <Link to="/admin" className="py-2 px-4 text-lg font-bold">
          admin
        </Link>
        <div className="flex flex-row overflow-y-auto md:flex-col">
          {adminRoutes.map((item: any) => (
            <Link
              key={item.name}
              to={`/admin/${item.name}`}
              className={classNames(
                "rounded-t-2xl py-2 px-4 md:rounded-l-2xl md:rounded-tr-none",
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