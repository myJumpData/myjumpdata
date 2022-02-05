import { useTranslation } from "react-i18next";
import { HiPlus } from "react-icons/hi";
import { TextInput } from "../components/Input";

export function SpeedDataInput({
  id,
  name,
  score,
  onSubmit,
}: {
  id: string;
  name: string;
  score: string;
  onSubmit: any;
}) {
  const { t } = useTranslation();
  return (
    <div className="border-t border-gray-300 dark:border-gray-700 py-2">
      <div className="flex items-end space-x-2">
        <label
          className="text-xl font-bold mr-auto leading-none translate-y-2"
          htmlFor={id}
        >
          {name}
        </label>
        <span className="text-xs whitespace-nowrap uppercase leading-none">
          {t("common:stats.high")}: {score}
        </span>
      </div>
      <form onSubmit={onSubmit}>
        <input type="hidden" name="id" value={id} />
        <div className="flex items-center space-x-2">
          <TextInput type="number" inline min="0" inputName={id} />
          <button
            className="h-10 w-10 bg-yellow-500 dark:bg-yellow-700 flex justify-center items-center text-xl rounded"
            type="submit"
            aria-label="submit"
          >
            <HiPlus />
          </button>
        </div>
      </form>
    </div>
  );
}
