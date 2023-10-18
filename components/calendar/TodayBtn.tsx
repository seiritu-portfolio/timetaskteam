import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import { today } from '@store/modules/calendar';
import { WEEKDAYS_JP } from '@util/constants';

interface TodayBtnProps {
  className?: string;
}

const TodayBtn = (props: TodayBtnProps) => {
  const { className = '' } = props;
  const dispatch = useDispatch();

  return (
    <div className={className}>
      <div
        className={
          'bg-white select-none cursor-pointer w-72px rounded-4px border border-separator body1'
        }
      >
        <div
          className={
            'rounded-4px active:bg-separator active:shadow text-fontPrimary'
          }
        >
          <div
            className={
              'flex items-center justify-center opacity-90 h-32px tooltip'
            }
            onClick={() => {
              dispatch(today());
            }}
          >
            今日
            <span className="absolute top-full mt-1 px-2 py-1 w-36 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext">
              {`${dayjs().format('MM月DD日')}（${
                WEEKDAYS_JP[dayjs().day()]
              }曜日）`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayBtn;
