import { lazy, ReactNode } from "react";
import { useSelector } from "react-redux";
import Alert from "../components/Alert";
import Footer from "./Footer";
import { Nav } from "./Nav";

const AdminNav = lazy(() => import("./AdminNav"));

export default function Wrapper({ children }: { children: ReactNode }) {
  const user = useSelector((state: any) => state.user);
  const route = useSelector((state: any) => state.route);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen overflow-x-hidden flex flex-col">
      <Nav />
      <div className="w-full h-full grow flex flex-col md:flex-row">
        {user?.roles?.includes("admin") &&
          route.match(new RegExp("admin(.*)")) && <AdminNav />}
        <div className="bg-white text-black dark:bg-black dark:text-white rounded-tl-3xl p-4 sm:p-8 grow">
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
