import { ReactNode } from "react";
import { useSelector } from "react-redux";
import Alert from "../components/Alert";
import Footer from "./Footer";
import { Nav, NavMain } from "./Nav";

export default function Wrapper({
  current,
  type,
  children,
}: {
  type?: "main";
  current: string;
  children: ReactNode;
}) {
  const user = useSelector((state: any) => state.user);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen overflow-x-hidden">
      {type === "main" ||
      user?.username === null ||
      user?.username === undefined ? (
        <NavMain current={current} />
      ) : (
        <Nav current={current} />
      )}
      <div className="bg-white text-black dark:bg-black dark:text-white w-full rounded-tl-3xl p-4 sm:p-8 lg:p-12 flex flex-col space-y-8">
        <Alert />
        {children}
      </div>
      <Footer />
    </div>
  );
}
