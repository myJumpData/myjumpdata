import { createElement, forwardRef } from "react";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import { HiChevronDown, HiChevronLeft, HiChevronRight } from "react-icons/hi";

export function DateInput({
  setDate,
  date,
}: {
  // eslint-disable-next-line no-unused-vars
  setDate: (d: Date) => void;
  date: Date;
}) {
  const { t, i18n } = useTranslation();
  const customInput = forwardRef(({ value, onClick }: any, ref: any) => {
    const i18n_lang = i18n.language;
    const options: any = {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const selected = new Date(value).toLocaleDateString(i18n_lang, options);
    let text = selected;
    const input = new Date(value).setHours(0, 0, 0, 0);
    if (input === new Date().setHours(0, 0, 0, 0)) {
      text = `${t("common:today")} (${selected})`;
    }
    return (
      <button
        className="flex w-full flex-row items-center justify-between"
        onClick={onClick}
        ref={ref}
      >
        <span className="truncate">{text}</span>
        <HiChevronDown />
      </button>
    );
  });
  return (
    <div>
      <DatePicker
        selected={date}
        onChange={(d: Date) => {
          setDate(d);
        }}
        closeOnScroll
        fixedHeight
        customInput={createElement(customInput)}
        calendarStartDay={1}
        todayButton={t<string>("common:today")}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }: any) => (
          <div className="m-2 flex justify-around">
            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
              <HiChevronLeft />
            </button>
            <span>
              {(() => {
                const d = new Date(date);
                d.setDate(1);
                d.setHours(0, 0, 0, 0);
                return d.toLocaleDateString(i18n.language, {
                  month: "long",
                });
              })()}
            </span>
            <span>
              {(() => {
                const d = new Date(date);
                d.setDate(1);
                d.setHours(0, 0, 0, 0);
                return d.toLocaleDateString(i18n.language, {
                  year: "numeric",
                });
              })()}
            </span>
            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
              <HiChevronRight />
            </button>
          </div>
        )}
      />
    </div>
  );
}
