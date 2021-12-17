import {Link} from "react-router-dom";

export default function OptionBox({
                                    link,
                                    heading,
                                    icon,
                                  }: {
  heading: string;
  icon?: any;
  link: any;
}) {
  return (
    <Link
      to={link}
      className="w-full bg-gray-300 px-8 py-4 rounded-lg shadow h-16 overflow-ellipsis overflow-hidden items-center flex md:justify-center hover:border hover:border-gray-400 hover:bg-gray-200"
    >
      {icon && <span className="inline-block mr-4 text-4xl w-8">{icon}</span>}
      <span className="font-bold text-xl">{heading}</span>
    </Link>
  );
}
