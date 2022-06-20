import classNames from "classnames";
import { useEffect } from "react";
import {
  HiCheckCircle,
  HiExclamation,
  HiInformationCircle,
  HiX,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { clearMessage } from "../redux/message.action";

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
          "flex w-full items-center justify-between rounded-lg py-1 px-2 outline outline-2 outline-offset-2 transition",
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

        <div className="w-full leading-none">{message.text}</div>
        <div
          className="dark:Text-gray-400 ml-2 self-start text-gray-600 transition hover:text-black dark:hover:text-white"
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
