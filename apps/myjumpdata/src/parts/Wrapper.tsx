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
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gray-100 dark:bg-gray-900">
      <Nav />
      <div className="flex h-full w-full grow flex-col md:flex-row">
        {user?.roles?.includes("admin") &&
          route.match(new RegExp("admin(.*)")) && <AdminNav />}
        <div className="min-w-0 grow rounded-tl-3xl bg-white p-4 text-black dark:bg-black dark:text-white sm:p-8">
          <div className="mb-auto flex flex-col space-y-8">
            <Alert />
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
