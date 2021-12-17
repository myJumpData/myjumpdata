import {Link} from "react-router-dom";

export function BottomNav({tabs}: { tabs: any }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 bg-white shadow flex md:hidden justify-between text-gray-800">
      {tabs &&
        tabs.map((tab: any) => (
          <Link
            className="w-full focus:text-yellow-500 hover:text-yellow-500 justify-center inline-block text-center pt-2 pb-1 transition duration-500 ease-in-out "
            to={tab.to}
            key={tab.name}
          >
            <span className="inline-block text-3xl">{tab.icon}</span>
            <span className="block text-xs">{tab.name}</span>
          </Link>
        ))}
    </div>
  );
}
