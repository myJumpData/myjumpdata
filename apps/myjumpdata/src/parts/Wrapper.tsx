import { ReactNode } from "react";
import Alert from "../components/Alert";
import Footer from "./Footer";
import { Nav } from "./Nav";

export default function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen overflow-x-hidden flex flex-col">
      <Nav />
      <div className="bg-white text-black dark:bg-black dark:text-white w-full rounded-tl-3xl p-4 sm:p-8 lg:p-12 flex flex-col h-full grow">
        <div className="mb-auto space-y-8">
          <Alert />
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
