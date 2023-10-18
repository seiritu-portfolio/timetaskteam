import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';

import { MoreMenuForTask } from './MoreMenuForTask';
import TabModalTask from './TabModalTask';
import { currentTaskSelector, ratesListSelector } from '@store/selectors/tasks';
import TaskCheckForDay from './TaskCheckForDay';
import { getDateISOFormat } from '@util/calendar';
import useRatesList from '@service/workRateQueries';
import { userInfoSelector } from '@store/selectors/user';
import { setCurrentRatesList } from '@store/modules/tasks';
import { TASK_STATUS_A_DAY } from '@util/constants';
import { useWorkRateMutation } from '@service/workRateMutation';

const ManageContinuation = ({
  currentTab,
  setCurrentTab,
}: {
  currentTab: number;
  setCurrentTab: (newValue: number) => void;
}) => {
  const ratesList = useSelector(ratesListSelector);
  const currentTask = useSelector(currentTaskSelector);
  const { user } = useSelector(userInfoSelector);

  const [rates, setRates] = useState<any[]>([]);
  useEffect(() => {
    if (!currentTask) {
      setRates([]);
    } else {
      const startDate = currentTask.start_date
        ? new Date(currentTask.start_date)
        : null;
      const endDate = currentTask.end_date
        ? new Date(currentTask.end_date)
        : null;

      if (startDate && endDate) {
        const theRatesList =
          ratesList.length === 0 || ratesList[0].task_id !== currentTask.id
            ? []
            : ratesList;
        let timeWorked = 0;
        const daysSetCount = theRatesList.length;
        if (daysSetCount > 0) {
          theRatesList.map((_) => {
            timeWorked += _.actual_time;
          });
        }
        const totalRequiredTime = Math.max(
          currentTask.required_time - timeWorked,
          0,
        );
        const totalRemainedDays =
          1 +
          Math.floor(
            (endDate.getTime() - startDate.getTime()) / (3600 * 24 * 1000),
          ) -
          daysSetCount;
        const requiredTime =
          totalRemainedDays > 0
            ? Math.ceil(totalRequiredTime / totalRemainedDays)
            : 0;

        const newRates: any[] = [];
        for (
          var d = startDate;
          d.getTime() <= endDate.getTime();
          d.setDate(d.getDate() + 1)
        ) {
          const dateFormatted = getDateISOFormat(d);
          const filteredRates = theRatesList.filter(
            (_) => _.due_date === dateFormatted,
          );
          const theRecord =
            filteredRates.length === 0 ? null : filteredRates[0];

          newRates.push({
            date: new Date(d.getTime()),
            dateFormatted,
            status: theRecord?.status ?? TASK_STATUS_A_DAY.UNSET,
            requiredTime: theRecord?.required_time ?? requiredTime,
            actualTime: theRecord?.actual_time ?? requiredTime,
          });
        }

        setRates(newRates);
      } else {
        setRates([]);
      }
    }
  }, [currentTask, ratesList]);

  const dispatch = useDispatch();
  const ratesListResult = useRatesList(currentTask?.id ?? 0, user?.id ?? 0);
  useEffect(() => {
    if (ratesListResult.isSuccess) {
      dispatch(setCurrentRatesList(ratesListResult.data));
    }
  }, [
    ratesListResult.isSuccess,
    ratesListResult.data,
    dispatch,
    ratesList,
    currentTask,
  ]);

  const queryClient = useQueryClient();
  const rateMutation = useWorkRateMutation(() => {
    queryClient.invalidateQueries('rates');
  });

  return (
    <div className="relative mt-24px body2 text-fontSecondary">
      <div className="py-12px rounded-8px bg-backgroundPrimary text-center">
        継続タスクは1日単位で管理することができます
      </div>
      <div className="mt-12px px-12px pt-12px pb-36px h-450px border-b border-separator overflow-y-auto">
        <div
          className={`lds-dual-ring absolute z-20 ${
            rateMutation.isLoading ? '' : 'invisible'
          }`}
        />
        {rates.map((rate) => (
          <TaskCheckForDay
            date={rate.date}
            defaultRequired={rate.requiredTime}
            currentStatus={rate.status}
            currentTime={rate.actualTime}
            onChange={(status: number, time: number) => {
              if (
                (status != rate.status || time != rate.time) &&
                !rateMutation.isLoading
              ) {
                rateMutation.mutate({
                  task_id: currentTask.id,
                  user_id: user?.id ?? 0,
                  due_date: rate.dateFormatted,
                  required_time: rate.requiredTime, // ! no need to save this
                  status,
                  actual_time: time,
                });
              }
            }}
            key={`task-check-day-${rate.dateFormatted}-${rate.status}-${rate.actualTime}`}
            disabled={rateMutation.isLoading}
          />
        ))}
      </div>
      <div className="py-24px flex-row--between">
        <TabModalTask currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <MoreMenuForTask upward={true} />
      </div>
    </div>
  );
};

export default ManageContinuation;
