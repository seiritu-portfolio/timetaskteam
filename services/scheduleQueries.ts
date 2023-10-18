import { useQuery } from 'react-query';

import axiosConfig from '@util/axiosConfig';
import { configBearerToken } from '@util/constants';
import { URL_SCHEDULE, URL_SCHEDULE_DETAIL } from '@util/urls';

const getSchdulesList = async ({
  filter,
  date,
  from_date,
  to_date,
  user_ids,
}: {
  filter?: string;
  date?: string;
  from_date?: string;
  to_date?: string;
  user_ids?: number[];
}) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const params: any = {};
  if (filter) {
    params['filter'] = filter;
  }
  if (date) {
    params['date'] = date;
  }
  if (from_date) {
    params['from_date'] = from_date;
  }
  if (to_date) {
    params['to_date'] = to_date;
  }
  if (user_ids) {
    params['user_ids'] = user_ids;
  }

  const { data } = await axiosConfig(URL_SCHEDULE, {
    params,
    ...config,
  });
  return data;
};

// export const getSchdulesListForUser = async ({
//   filter,
//   date,
//   from_date,
//   to_date,
//   id,
// }: {
//   filter?: string;
//   date?: string;
//   from_date?: string;
//   to_date?: string;
//   id: number;
// }) => {
//   const token = localStorage.getItem('task3_token');
//   const config = configBearerToken(token ?? '');

//   const params: any = {};
//   if (filter) {
//     params['filter'] = filter;
//   }
//   if (date) {
//     params['date'] = date;
//   }
//   if (from_date) {
//     params['from_date'] = from_date;
//   }
//   if (to_date) {
//     params['to_date'] = to_date;
//   }

//   const { data } = await axiosConfig.get(URL_SCHEDULE, {
//     params,
//     ...config,
//   });
//   return data;
// };

const getScheduleDetailForUser = async (user_id: number, id: number) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(
    URL_SCHEDULE_DETAIL.replace(/%s/g, id.toString()),
    {
      ...config,
      params: {
        user_id,
      },
    },
  );
  return data;
};

const getSchedulesForKeyword = async ({
  keyword,
  coop_user_id,
}: {
  keyword: string;
  coop_user_id?: number[];
}) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const params: any = {
    filter: 'keyword',
    keyword,
  };
  if (coop_user_id) {
    params['coop_user_id'] = coop_user_id;
  }

  const { data } = await axiosConfig.get(URL_SCHEDULE, { params, ...config });
  return data;
};

const getScheduleDetail = async (id: number) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(
    URL_SCHEDULE_DETAIL.replace(/%s/g, id.toString()),
    {
      ...config,
    },
  );
  return data;
};

const useSchedulesList = (filter?: string, date?: string) => {
  return useQuery(
    ['schedules', { filter, date }],
    () => getSchdulesList({ filter, date }),
    {},
  );
};

const useSchdulesForCalendar = ({
  from_date,
  to_date,
  user_ids,
}: {
  from_date: string;
  to_date: string;
  user_ids: number[];
}) => {
  return useQuery(
    ['schedules', { filter: 'calendar', from_date, to_date, user_ids }],
    () =>
      getSchdulesList({
        filter: 'calendar',
        from_date,
        to_date,
        user_ids,
      }),
    {
      enabled: from_date !== '' && to_date !== '' && user_ids.length > 0,
    },
  );
};

const useSchedulesForKeyword = (keyword: string, coop_user_id?: number[]) => {
  return useQuery(
    ['schedules', { filter: 'search', keyword, coop_user_id }],
    () => getSchedulesForKeyword({ keyword, coop_user_id }),
    {
      enabled: keyword !== '',
    },
  );
};

export const useScheduleADay = (
  date: string,
  filter: string,
  user_ids: number[],
) => {
  return useQuery(['schedules', { filter: filter, date }], () =>
    getSchdulesList({
      filter,
      date,
      user_ids,
    }),
  );
};

export const useScheduleDetail = (id: number | null, loading: boolean) => {
  return useQuery(['schedules', { id }], () => getScheduleDetail(id ?? 0), {
    enabled: id != null && id > 0 && !loading,
  });
};

export const useScheduleDetailForUser = (
  userId: number,
  id: number | null,
  loading: boolean,
) => {
  return useQuery(
    ['schedules', { id, userId }],
    () => getScheduleDetailForUser(userId, id ?? 0),
    {
      enabled: id != null && id > 0 && userId > 0 && !loading,
    },
  );
};

// export const useScheduleADay = (date: string) => {
//   return useQuery(
//     ['schedules', { filter: 'calendar', date }],
//     () =>
//       getSchdulesList({
//         filter: 'calendar',
//         from_date: date,
//         to_date: date,
//       }),
//     {
//       enabled: date !== '',
//     },
//   );
// };

export { useSchedulesList, useSchdulesForCalendar, useSchedulesForKeyword };
