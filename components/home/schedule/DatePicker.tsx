import { useEffect, useRef } from 'react';
import { Calendar } from 'react-date-range';
// @ts-ignore
import * as rdrLocales from 'react-date-range/dist/locale';

import LeftIcon from '@svg/left-arrow.svg';
import RightIcon from '@svg/right-arrow.svg';
import { WEEKDAYS_JP } from '@util/constants';

const DatePicker = ({
  isOpen,
  className,
  index,
  date,
  classNameCalendar,
  placeholder,
  setWidth,
  onChange,
  onClick,
}: {
  isOpen: boolean;
  className: string;
  index: number;
  date?: Date;
  classNameCalendar?: string;
  placeholder?: string;
  onClick: () => void;
  onChange?: (newValue: Date) => void;
  setWidth?: (newValue: number) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<number>(new Date().getMonth());

  useEffect(() => {
    if (containerRef.current && setWidth) {
      setWidth(containerRef.current.offsetWidth);
    }
    const handleWindowsResize = () => {
      if (containerRef.current && setWidth) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleWindowsResize);
    return () => {
      window.removeEventListener('resize', handleWindowsResize);
    };
  }, [setWidth]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative full ${className} cursor-pointer flex-row--between`}
      tabIndex={index}
    >
      <span
        className={`flex-1 px-2 py-12px w-full ${
          date ? '' : 'text-center text-fontSecondary'
        }`}
      >
        {date
          ? (date.getMonth() + 1).toString() +
            '月' +
            date.getDate().toString() +
            '日(' +
            WEEKDAYS_JP[date.getDay()] +
            ')'
          : placeholder}
      </span>
      {isOpen && (
        <>
          <div className="fixed inset-0" />
          <div
            className="absolute mt-6 inset-0 z-30"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Calendar
              locale={rdrLocales.ja}
              className={`border border-separator ${classNameCalendar ?? ''}`}
              date={date}
              onChange={(e) => {
                if (onChange) onChange(e);
              }}
              // @ts-ignore
              navigatorRenderer={(currentFocusedDate, changeShownDate) => {
                const currentMonth = currentFocusedDate.getMonth();
                if (monthRef.current) {
                  monthRef.current = currentMonth;
                }

                return (
                  <div className="pt-2 pb-1 px-6 text-fontPrimary body1 flex-row--between">
                    <div className="">
                      <span className="">
                        {currentFocusedDate.getFullYear()}
                      </span>
                      年
                      <span className="">
                        {currentFocusedDate.getMonth() + 1}
                      </span>
                      月
                    </div>
                    <div className="flex flex-row items-center">
                      <span
                        onClick={() => {
                          const newMonth =
                            currentMonth === 0 ? 11 : currentMonth - 1;
                          monthRef.current = newMonth;
                          changeShownDate(currentMonth - 1, 'setMonth');
                        }}
                        className="h-24px w-24px flex-xy-center rounded-full flex-xy-center cursor-pointer hover:bg-separator"
                      >
                        <LeftIcon width={9} height={9} />
                      </span>
                      <span
                        onClick={() => {
                          const newMonth =
                            currentMonth === 0 ? 11 : currentMonth + 1;
                          monthRef.current = newMonth;
                          changeShownDate(currentMonth + 1, 'setMonth');
                        }}
                        className="ml-2 h-24px w-24px flex-xy-center rounded-full flex-xy-center cursor-pointer hover:bg-separator"
                      >
                        <RightIcon width={9} height={9} />
                      </span>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DatePicker;
