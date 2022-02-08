import { classNames } from "@myjumpdata/utils";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import Footer from "./Footer";
import { Nav } from "./Nav";

export default function Wrapper({ children }: { children: ReactNode }) {
  const user = useSelector((state: any) => state.user);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen overflow-x-hidden flex flex-col">
      <Nav />
      <div className="w-full h-full grow flex">
        {user.roles.includes("admin") && <AdminNav />}
        <div className="bg-white text-black dark:bg-black dark:text-white rounded-tl-3xl p-4 sm:p-8 lg:p-12 grow">
          <div className="mb-auto space-y-8 flex flex-col">
            <Alert />
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
function AdminNav() {
  const route = useSelector((state: any) => state.route);

  return (
    <div className="text-black dark:text-white min-w-[10rem] flex flex-col">
      <Link to="/admin" className="p-2 font-bold text-lg">
        admin
      </Link>
      {[
        { name: "home", current: route === "admin/home" },
        { name: "users", current: route === "admin/users" },
        { name: "groups", current: route === "admin/groups" },
        { name: "freestyle", current: route === "admin/freestyle" },
      ].map((item: any) => (
        <Link
          to={`/admin/${item.name}`}
          className={classNames(
            "p-2",
            item.current && "bg-white dark:bg-black"
          )}
        >
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );
}
