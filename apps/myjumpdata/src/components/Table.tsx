import classNames from "classnames";
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
  structure:
    | ({
        name: string;
        key: string;
        options?: {
          align?: "text-center" | "text-left" | "text-right" | string;
        };
      } | null)[];
  data: any[] | undefined;
  total?: number;
  page?: number;
  pages?: number;
  setPage?: Dispatch<SetStateAction<number>>;
  limit?: number;
  setLimit?: Dispatch<SetStateAction<number>>;
}) {
  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {structure.map((item) => {
                if (item) {
                  return (
                    <th
                      key={item.key}
                      className={classNames(
                        "whitespace-nowrap p-1",
                        item.options?.align
                      )}
                    >
                      {item.name}
                    </th>
                  );
                }
                return "";
              })}
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((row, rowIndex) => {
                if (row) {
                  return (
                    <tr key={rowIndex}>
                      {structure.map((item) => {
                        if (item) {
                          return (
                            <td
                              key={item.key}
                              className={classNames(
                                "whitespace-nowrap p-1",
                                item.options?.align
                              )}
                            >
                              {row[item.key]}
                            </td>
                          );
                        }
                        return "";
                      })}
                    </tr>
                  );
                }
                return "";
              })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-between">
        {total && (
          <span className="whitespace-nowrap">Total data: {total}</span>
        )}
        {limit && total && setLimit && (
          <div className="w-24 px-2">
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
        )}
        {pages && page && setPage && (
          <div className="flex grow justify-center py-2">
            <Pagination page={page} setPage={setPage} pages={pages} />
          </div>
        )}
      </div>
    </>
  );
}
