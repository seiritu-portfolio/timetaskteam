import { useQuery } from 'react-query';

import axiosConfig from '@util/axiosConfig';
import { configBearerToken } from '@util/constants';
import { URL_COLLABOS_RATES, URL_RATE } from '@util/urls';

const getRatesList = async (taskId: number, userId: number) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(URL_RATE, {
    params: {
      task_id: taskId,
      user_id: userId,
    },
    ...config,
  });
  return data;
};

const getRatesForCollabs = async ({
  from_date,
  to_date,
  user_id,
}: {
  from_date: string;
  to_date: string;
  user_id: number[];
}) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(URL_COLLABOS_RATES, {
    params: {
      from_date,
      to_date,
      user_id,
    },
    ...config,
  });
  return data;
};

const useRatesList = (taskId: number, userId: number) => {
  return useQuery(
    ['rates', { taskId, userId }],
    () => getRatesList(taskId ?? 0, userId),
    {
      enabled: taskId > 0 && userId > 0,
    },
  );
};

export const useRatesForCollabs = (
  from_date: string,
  to_date: string,
  user_id: number[],
) => {
  return useQuery(
    ['rates', { from_date, to_date, user_id }],
    () =>
      getRatesForCollabs({
        from_date,
        to_date,
        user_id,
      }),
    {
      enabled: user_id.length > 0,
    },
  );
};

export default useRatesList;
