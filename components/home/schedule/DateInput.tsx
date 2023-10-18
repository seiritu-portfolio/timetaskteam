import { useState } from 'react';
import { Calendar } from 'react-date-range';
// @ts-ignore
import * as rdrLocales from 'react-date-range/dist/locale';

import ResetIcon from '@svg/multiply-circle-fill-small.svg';
import { WEEKDAYS_JP } from '@util/constants';

const DateInput = ({
  className,
  date,
  changeDate,
  defaultText,
}: {
  className: string;
  date: Date | null;
  changeDate: any;
  defaultText?: string;
}) => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [reset, setReset] = useState(false);

  return (
    <div
      className={`relative px-16px h-44px rounded-8px bg-backgroundPrimary body1 flex-row--between focus:bg-overlayWeb2 ${className}`}
      onClick={() => {
        setOpenCalendar((old: boolean) => !old);
      }}
    >
      <span className={date ? `text-fontPrimary` : 'text-fontSecondary'}>
        {date
          ? (date.getMonth() + 1).toString() +
            '月' +
            date.getDate().toString() +
            '日' +
            '(' +
            WEEKDAYS_JP[date.getDay()] +
            ')'
          : defaultText ?? '日付'}
      </span>
      {date && (
        <ResetIcon
          width={20}
          height={20}
          onClick={(e: any) => {
            e.stopPropagation();
            changeDate(null);
            setReset(false);
          }}
          className="text-fontSecondary"
        />
      )}
      {openCalendar && (
        <>
          <div className="absolute mt-6 inset-0 z-9999">
            <Calendar
              locale={rdrLocales.ja}
              date={date ? date : undefined}
              onChange={(e) => {
                setReset(true);
                changeDate(e);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DateInput;
