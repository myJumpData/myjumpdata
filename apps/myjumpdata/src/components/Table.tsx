import { classNames } from "@myjumpdata/utils";
import { Dispatch, SetStateAction } from "react";
import { SelectInput } from "./Input";
import Pagination from "./Pagination";

export default function Table({
  structure,
  data,
  total,
  page,
  pages,
  setPage,
  limit,
  setLimit,
}: {
  structure: {
    name: string;
    key: string;
    options?: { align?: "text-center" | "text-left" | "text-right" };
  }[];
  data: any[] | undefined;
  total: number;
  page: number;
  pages: number;
  setPage: Dispatch<SetStateAction<number>>;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
}) {
  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {structure.map((item) => (
                <th
                  key={item.key}
                  className={classNames(
                    "whitespace-nowrap p-1",
                    item.options?.align
                  )}
                >
                  {item.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {structure.map((item) => (
                    <td
                      key={item.key}
                      className={classNames(
                        "whitespace-nowrap p-1",
                        item.options?.align
                      )}
                    >
                      {row[item.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row items-center justify-between">
        <span>Total data: {total}</span>
        <div className="w-24">
          <SelectInput
            options={[
              ...[5, 10, 25, 50, 100].filter((value) => value < total),
              limit,
            ]
              .sort((a, b) => a - b)
              .filter((value, index, array) => array.indexOf(value) === index)
              .map((value) => {
                return { name: value, value };
              })}
            stateChange={setLimit}
            current={limit}
          />
        </div>
        {page && pages && setPage && (
          <Pagination page={page} setPage={setPage} pages={pages} />
        )}
      </div>
    </>
  );
}
