import { useRef } from 'react';
import { DateRange } from 'react-date-range';
// @ts-ignore
import * as rdrLocales from 'react-date-range/dist/locale';

import PrevIcon from '@svg/arrowtriangle-left-fill.svg';
import NextIcon from '@svg/arrowtriangle-right-fill.svg';

const CustomDateRange = ({
  state,
  setState,
}: {
  state: any;
  setState: any;
}) => {
  const monthRef = useRef<number>(new Date().getMonth());

  return (
    <DateRange
      locale={rdrLocales.ja}
      showPreview
      rangeColors={['#007aff']}
      showDateDisplay={false}
      showMonthAndYearPickers={false}
      // @ts-ignore
      onChange={(item) => setState(item)}
      moveRangeOnFirstSelection={false}
      monthDisplayFormat="MMM---yyyy"
      // @ts-ignore
      ranges={state}
      onShownDateChange={(date) => {}}
      // @ts-ignore
      navigatorRenderer={(currentFocusedDate, changeShownDate) => {
        const currentMonth = currentFocusedDate.getMonth();
        if (monthRef.current) {
          monthRef.current = currentMonth;
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

export default CustomDateRange;
