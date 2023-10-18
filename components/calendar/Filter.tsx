import { useDispatch } from 'react-redux';
import { Dayjs } from 'dayjs';
// * hooks
import { useToday } from '@service/hooks/useSchedules';
import { setStartdateUnset } from '@store/modules/calendar';
// * components
import CloseIcon from '@svg/multiply.svg';

const Filter = ({
  currentDate,
  startdateUnset,
  calendarFilter,
  sortBy,
  className,
  onCloseSidebar,
}: {
  currentDate: Dayjs;
  startdateUnset?: boolean;
  calendarFilter: string;
  sortBy: (newValue: string) => void;
  className?: string;
  onCloseSidebar: () => void;
}) => {
  const today = useToday();

  const dispatch = useDispatch();

  return (
    <div className={`${className}`}>
      <div className={`flex justify-between space-x-24px py-8px border-b`}>
        <div
          className={
            'flex bg-backgroundPrimary body1 p-2px w-300px rounded-8px'
          }
        >
          {calendarFilter === 'start_date' ? (
            <div className={'relative flex items-center h-40px'}>
              <div
                className={`absolute left-0 inset-y-0 flex bg-white transition-all ease-in-out duration-200 transform shadow h-40px w-100px rounded-8px ${
                  startdateUnset === undefined
                    ? 'translate-x-fullX2'
                    : startdateUnset === true
                    ? 'translate-x-full'
                    : 'translate-x-0'
                }`}
              />
              <div
                className={`relative flex items-center justify-center cursor-pointer select-none w-100px transition-all ease-in-out duration-200 ${
                  startdateUnset === false ? 'opacity-90' : 'opacity-40'
                }`}
                onClick={() => dispatch(setStartdateUnset(false))}
              >
                {currentDate.format('YYYY-MM-DD') === today.format('YYYY-MM-DD')
                  ? '今'
                  : currentDate.date()}
                日の予定
              </div>
              <div
                className={`relative flex items-center justify-center cursor-pointer select-none w-100px transition-all ease-in-out duration-200 ${
                  startdateUnset === true ? 'opacity-90' : 'opacity-40'
                }`}
                onClick={() => dispatch(setStartdateUnset(true))}
              >
                開始日未定
              </div>
              <div
                className={`relative flex items-center justify-center cursor-pointer select-none w-100px transition-all ease-in-out duration-200 ${
                  startdateUnset === undefined ? 'opacity-90' : 'opacity-40'
                }`}
                onClick={() => dispatch(setStartdateUnset(undefined))}
              >
                全ての予定
              </div>
            </div>
          ) : (
            <div className="relative flex-1 h-40px rounded-8px bg-backgroundSecondary inset-y-0 flex items-center justify-center shadow select-none">
              <div className="relative cursor-pointer select-none opacity-90">
                {currentDate.format('YYYYMMDD') === today.format('YYYYMMDD')
                  ? '今'
                  : currentDate.date()}
                日期限のタスク
              </div>
            </div>
          )}
        </div>
        <div className={'flex items-center'}>
          <div
            className={
              'flex items-center justify-center cursor-pointer h-40px w-40px rounded-8px active:bg-backgroundPrimary tooltip'
            }
            onClick={onCloseSidebar}
          >
            <CloseIcon width={20} height={20} />
            <span className="absolute top-full mt-1 px-2 py-1 w-20 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext">
              閉じる
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
