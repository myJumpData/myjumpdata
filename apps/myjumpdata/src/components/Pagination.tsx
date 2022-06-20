import classNames from "classnames";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

export default function Pagination({
  page,
  pages,
  setPage,
}: {
  page: number;
  pages: number;
  setPage: Dispatch<SetStateAction<number>>;
}) {
  function Button({
    children,
    onClick,
    active,
    disabled,
  }: {
    children: ReactNode;
    onClick: any;
    active?: boolean;
    disabled?: boolean;
  }) {
    return (
      <span
        onClick={() => {
          if (!disabled) {
            onClick();
          }
        }}
        className={classNames(
          "flex h-8 w-8 items-center justify-center rounded-full bg-gray-500/50 text-white transition",
          { "outline outline-yellow-500": active },
          { "cursor-pointer hover:bg-yellow-500 hover:text-black": !disabled },
          { "opacity-50": disabled }
        )}
      >
        {children}
      </span>
    );
  }
  const start_num = (() => {
    if (pages >= 5) {
      if (page >= pages) {
        return page - 4;
      }
      if (page >= pages - 1) {
        return page - 3;
      }
    }
    if (page > 3) {
      return page - 2;
    }
    return 1;
  })();
  let nums = [
    start_num,
    start_num + 1,
    start_num + 2,
    start_num + 3,
    start_num + 4,
  ];
  if (pages < 5) {
    nums = nums.splice(0, pages);
  }
  return (
    <div className="flex flex-row items-center justify-between space-x-4">
      <Button
        onClick={() => {
          setPage(page - 1);
        }}
        disabled={page <= 1}
      >
        <HiArrowLeft />
      </Button>
      {nums.map((num: number) => (
        <Button
          key={num}
          onClick={() => {
            setPage(num);
          }}
          active={num === page}
        >
          {num}
        </Button>
      ))}
      <Button
        onClick={() => {
          setPage(page + 1);
        }}
        disabled={!pages || page >= pages}
      >
        <HiArrowRight />
      </Button>
    </div>
  );
}
