import { useRef } from 'react';
import { Calendar } from 'react-date-range';
// @ts-ignore
import * as rdrLocales from 'react-date-range/dist/locale';

import PrevIcon from '@svg/arrowtriangle-left-fill.svg';
import NextIcon from '@svg/arrowtriangle-right-fill.svg';

const MultipleDatePick = ({
  selectedDates,
  noInactiveDays,
  selectedWeekdays,
  changeActiveMonth,
  onDayClick,
}: {
  selectedDates: Date[];
  noInactiveDays: Date[];
  selectedWeekdays: string[];
  changeActiveMonth: (newValue: number) => void;
  onDayClick: (item: any) => void;
}) => {
  const monthRef = useRef<number>(new Date().getMonth());

  return (
    <Calendar
      locale={rdrLocales.ja}
      displayMode="date"
      onChange={onDayClick}
      // onChange={(item) => {
      //   if (!(item instanceof Date)) {
      //     return;
      //   }
      //   if (selectedDates.length === 0) {
      //     setSelectedDates([item]);
      //   }

      //   const filteredSelectedDates = selectedDates.filter(
      //     (dateValue) => dateValue.getTime() !== item.getTime(),
      //   );
      //   if (filteredSelectedDates.length === selectedDates.length) {
      //     setSelectedDates([...selectedDates, item]);
      //   } else {
      //     setSelectedDates(filteredSelectedDates);
      //   }
      // }}
      showMonthAndYearPickers={false}
      dayContentRenderer={(curDate) => {
        const selectedDatesTime = selectedDates.map((_) => _.getTime());
        const noSelectedDatesTime = noInactiveDays.map((_) => _.getTime());
        let className = '';
        if (
          !noSelectedDatesTime.includes(curDate.getTime()) &&
          (selectedDatesTime.includes(curDate.getTime()) ||
            selectedWeekdays.includes(curDate.getDay().toString())) &&
          curDate.getMonth() === monthRef.current
        ) {
          className = 'selected custom-label';
        } else {
          className = 'custom-label';
        }
        return (
          <>
            <div className={className} />
            <span className="dateSection">{curDate.getDate()}</span>
          </>
        );
      }}
      navigatorRenderer={(currentFocusedDate, changeShownDate) => {
        const currentMonth = currentFocusedDate.getMonth();
        if (monthRef.current) {
          monthRef.current = currentMonth;
          changeActiveMonth(currentMonth);
        }
        return (
          <div className="h-44px text-fontPrimary flex-row--between">
            <div className="big-title">
              <span className="bigger-title-en">
                {currentFocusedDate.getFullYear()}
              </span>
              年
              <span className="bigger-title-en">
                {currentFocusedDate.getMonth() + 1}
              </span>
              月
            </div>
            <div className="flex flex-row items-center">
              <span
                className="h-44px w-44px rounded-l-8px bg-backgroundPrimary flex-xy-center cursor-pointer"
                onClick={() => {
                  const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                  monthRef.current = newMonth;
                  changeShownDate(currentMonth - 1, 'setMonth');
                  changeActiveMonth(newMonth);
                }}
              >
                <PrevIcon width={16} height={16} />
              </span>
              <span
                className="h-44px w-44px rounded-r-8px bg-backgroundPrimary flex-xy-center cursor-pointer"
                onClick={() => {
                  const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
                  monthRef.current = newMonth;
                  changeShownDate(currentMonth + 1, 'setMonth');
                  changeActiveMonth(newMonth);
                }}
              >
                <NextIcon width={16} height={16} />
              </span>
            </div>
          </div>
        );
      }}
    />
  );
};

export default MultipleDatePick;
