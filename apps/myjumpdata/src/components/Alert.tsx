import { useEffect } from "react";
import {
  HiCheckCircle,
  HiExclamation,
  HiInformationCircle,
  HiX,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import classNames from "../helper/classNames";
import { clearMessage } from "../store/message.action";

export default function Alert() {
  const message = useSelector((state: any) => state.message);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      clearMessage();
    }, 20000);
    return () => clearTimeout(timeoutId);
  }, [message]);

  if (message?.text && message?.text !== "" && message?.text !== null) {
    return (
      <div
        className={classNames(
          "outline outline-2 outline-offset-2 rounded-lg flex py-1 px-2 items-center justify-between transition w-full",
          message.design === "primary" && "outline-yellow-500",
          message.design === "secondary" && "outline-gray-500",
          message.design === "success" && "outline-green-500",
          message.design === "danger" && "outline-red-500",
          message.design === "warning" && "outline-orange-500",
          message.design === "info" && "outline-blue-500"
        )}
      >
        {message.icon && (
          <div
            className={classNames(
              "mr-2 text-2xl",
              "flex items-center justify-center",
              message.design === "primary" && "text-yellow-500",
              message.design === "secondary" && "text-gray-500",
              message.design === "success" && "text-green-500",
              message.design === "danger" && "text-red-500",
              message.design === "warning" && "text-orange-500",
              message.design === "info" && "text-blue-500"
            )}
          >
            {message.design === "primary" && <HiInformationCircle />}
            {message.design === "secondary" && <HiInformationCircle />}
            {message.design === "success" && <HiCheckCircle />}
            {message.design === "danger" && <HiExclamation />}
            {message.design === "warning" && <HiExclamation />}
            {message.design === "info" && <HiInformationCircle />}
          </div>
        )}

        <div className="leading-none w-full">{message.text}</div>
        <div
          className="text-gray-600 dark:Text-gray-400 hover:text-black dark:hover:text-white transition ml-2 self-start"
          onClick={() => {
            clearMessage();
          }}
        >
          <HiX />
        </div>
      </div>
    );
  }
  return <Outlet />;
}
