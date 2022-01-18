import { TailSpin } from "react-loader-spinner";
import { PrimaryColor } from "../Constants";

export default function Spinner() {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 fixed z-50 top-0 bottom-0 left-0 right-0">
      <TailSpin color={PrimaryColor} />
    </div>
  );
}
