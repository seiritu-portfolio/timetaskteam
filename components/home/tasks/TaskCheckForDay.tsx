import { HourSelect, ProcessSelect } from '../Selects';
import { TASK_STATUS_A_DAY } from '@util/constants';

const TaskCheckForDay = ({
  date,
  defaultRequired,
  additionalClassName,
  currentStatus,
  currentTime,
  onChange,
  disabled,
}: {
  date: Date;
  defaultRequired: number;
  additionalClassName?: string;
  currentStatus: number;
  currentTime: number;
  onChange: (status: number, time: number) => void;
  disabled: boolean;
}) => {
  return (
    <div className={`pt-12px ${additionalClassName}`}>
      <div className="body2-en">
        {(() => {
          const year = date.getFullYear();
          const month = date.getMonth();
          const day = date.getDate();

          return day === 1 ? (
            month === 0 ? (
              <>
                {year}
                <span className="body2">年</span>
                {month + 1}
                <span className="body2">月</span>
                {day}
                <span className="body2">日</span>
              </>
            ) : (
              <>
                {month + 1}
                <span className="body2">月</span>
                {day}
                <span className="body2">日</span>
              </>
            )
          ) : (
            <>{day}日</>
          );
        })()}
      </div>
      <div className="w-full flex-row--between">
        <ProcessSelect
          value={currentStatus}
          setValue={(newValue: number) => {
            if (!disabled) {
              onChange(
                newValue,
                newValue === TASK_STATUS_A_DAY.UNDONE ? 0 : currentTime,
              );
            }
          }}
          instanceId={date.getMonth() * 100 + date.getDate()}
        />
        <HourSelect
          value={currentTime}
          setValue={(newValue: number) => {
            if (!disabled && currentStatus !== TASK_STATUS_A_DAY.UNSET) {
              onChange(currentStatus, newValue);
            }
          }}
          instanceId={date.getMonth() * 100 + date.getDate()}
        />
      </div>
      <div className="ml-36px h-1px border-t-1/2 border-separator" />
    </div>
  );
};

export default TaskCheckForDay;
