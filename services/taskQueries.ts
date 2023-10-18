import { useQueries, useQuery } from 'react-query';
// * utils
import axiosConfig from '@util/axiosConfig';
import { configBearerToken, TASK_SORT_TYPE } from '@util/constants';
import {
  URL_TASK,
  URL_TASKS_FILL_STARTDATE,
  URL_TASKS_LIST_COUNTS,
  URL_TASK_DETAIL,
  URL_TASK_FOR_USER,
} from '@util/urls';

const getTaskDetail = async (id: number) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(
    URL_TASK_DETAIL.replace(/%s/g, id.toString()),
    {
      ...config,
    },
  );
  return data;
};

const getTaskDetailForUser = async (user_id: number, id: number) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(
    URL_TASK_DETAIL.replace(/%s/g, id.toString()),
    {
      ...config,
      params: {
        user_id,
      },
    },
  );
  return data;
};

const getTasksList = async ({
  filter,
  date,
  from_date,
  to_date,
  list_id,
  user_ids,
  subfilter,
  is_repetition_off,
}: {
  filter?: string;
  date?: string;
  from_date?: string;
  to_date?: string;
  list_id?: number;
  user_ids?: number[];
  subfilter?: TASK_SORT_TYPE;
  is_repetition_off?: boolean;
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
  if (list_id) {
    params['list_id'] = list_id;
  }
  if (user_ids) {
    params['user_ids'] = user_ids;
  }
  if (subfilter) {
    params['subfilter'] = subfilter;
  }
  if (is_repetition_off) {
    params['is_repetition_off'] = true;
  }
  const { data } = await axiosConfig.get(URL_TASK, {
    params,
    ...config,
  });
  return data;
};

const getTasksListForUser = async ({
  id,
  filter,
  subfilter,
  date,
  from_date,
  to_date,
  list_id,
}: {
  id: number;
  filter?: string;
  subfilter?: TASK_SORT_TYPE;
  date?: string;
  from_date?: string;
  to_date?: string;
  list_id?: number;
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
  if (list_id) {
    params['list_id'] = list_id;
  }
  if (subfilter) {
    params['subfilter'] = subfilter;
  }

  const { data } = await axiosConfig.get(
    URL_TASK_FOR_USER.replace(/\%s/g, id.toString()),
    {
      params,
      ...config,
    },
  );
  return data;
};

const getTasksForKeyword = async ({
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

  const { data } = await axiosConfig.get(URL_TASK, { params, ...config });
  return data;
};

const getTasksFillStartdate = async () => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  return await axiosConfig.get(URL_TASKS_FILL_STARTDATE, { ...config });
};

const getTasksCounts = async (id: number) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(
    URL_TASKS_LIST_COUNTS.replace(/\%s/g, id.toString()),
    { ...config },
  );
  return data;
};

const useTaskDetail = (id: number | null, loading: boolean) => {
  return useQuery(['tasks', { id }], () => getTaskDetail(id ?? 0), {
    enabled: id != null && id > 0 && !loading,
  });
};

export const useTaskDetailForUser = (
  userId: number,
  id: number | null,
  loading: boolean,
) => {
  return useQuery(
    ['tasks', { id, userId }],
    () => getTaskDetailForUser(userId, id ?? 0),
    {
      enabled: id != null && id > 0 && userId > 0 && !loading,
    },
  );
};

export const useTaskDetailForUserList = (
  userIdList: number[],
  id: number | null,
  loading: boolean,
) => {
  return useQueries(
    userIdList.map((userId) => {
      return {
        queryKey: ['tasks', { id, userId }],
        queryFn: () => getTaskDetailForUser(userId, id ?? 0),
      };
    }),
  );
};

const useTasksList = (filter?: string, date?: string) => {
  return useQuery(
    ['tasks', { filter, date }],
    () => getTasksList({ filter, date }),
    {},
  );
};

const useTasksForCalendar = ({
  from_date,
  to_date,
  user_ids,
  sortType,
  is_repetition_off,
}: {
  from_date: string;
  to_date: string;
  user_ids: number[];
  sortType?: TASK_SORT_TYPE;
  is_repetition_off?: boolean;
}) => {
  return useQuery(
    ['tasks', { filter: 'calendar', from_date, to_date, user_ids, sortType }],
    () =>
      getTasksList({
        filter: 'calendar',
        from_date,
        to_date,
        user_ids,
        subfilter: sortType,
        is_repetition_off,
      }),
    {
      enabled: from_date !== '' && to_date !== '' && user_ids.length > 0,
    },
  );
};

const useTasksForKeyword = (keyword: string, coop_user_id?: number[]) => {
  return useQuery(
    ['tasks', { filter: 'search', keyword, coop_user_id }],
    () => getTasksForKeyword({ keyword, coop_user_id }),
    {
      enabled: keyword !== '',
    },
  );
};

const useTasksADay = (date: string, filter: string, user_ids: number[]) => {
  return useQuery(
    ['tasks', { filter, date }],
    () =>
      getTasksList({
        filter,
        date,
        user_ids,
      }),
    {
      enabled: date !== '',
    },
  );
};

export const useTasksADayWithUser = (
  id: number,
  date: string,
  filter: string,
) => {
  return useQuery(
    ['tasks', { id, filter, date }],
    () =>
      getTasksListForUser({
        id,
        filter,
        date,
      }),
    {
      enabled: date !== '' && id > 0,
    },
  );
};

const useTasksAll = (sortType: TASK_SORT_TYPE) => {
  return useQuery(['tasks', { filter: sortType }], () =>
    getTasksList({
      filter: sortType.toString(),
    }),
  );
};

export const useTasksCount = (id: number) =>
  useQuery(['tasks', { count: true, id }], () => getTasksCounts(id), {
    enabled: id > 0,
  });

export const useTasksAllWithUser = (id: number, sortType: TASK_SORT_TYPE) => {
  return useQuery(
    ['tasks', { id, filter: sortType }],
    () =>
      getTasksListForUser({
        id,
        filter: sortType,
      }),
    {
      enabled: id > 0,
    },
  );
};

const useTasksRequest = () => {
  return useQuery(['tasks', { filter: 'request' }], () =>
    getTasksList({
      filter: 'request',
    }),
  );
};

export const useTasksRequestWithUser = (
  id: number,
  sortType: TASK_SORT_TYPE,
) => {
  return useQuery(
    ['tasks', { id, filter: 'request', sortType }],
    () =>
      getTasksListForUser({
        id,
        filter: 'request',
        subfilter: sortType,
      }),
    {
      enabled: id > 0,
    },
  );
};

const useTasksRequested = () => {
  return useQuery(['tasks', { filter: 'requested' }], () =>
    getTasksList({
      filter: 'requested',
    }),
  );
};

export const useTasksRequestedWithUser = (
  id: number,
  sortType: TASK_SORT_TYPE,
) => {
  return useQuery(
    ['tasks', { id, filter: 'requested', sortType }],
    () =>
      getTasksListForUser({
        id,
        filter: 'requested',
        subfilter: sortType,
      }),
    {
      enabled: id > 0,
    },
  );
};

export const useTasksForList = (sortType: TASK_SORT_TYPE, listID: number) => {
  return useQuery(['tasks', { filter: sortType, listID }], () =>
    getTasksList({
      filter: sortType,
      list_id: listID,
    }),
  );
};

export const useTasksForListWithUser = (
  id: number,
  sortType: TASK_SORT_TYPE,
  listID: number,
) => {
  return useQuery(
    ['tasks', { id, filter: sortType, listID }],
    () =>
      getTasksListForUser({
        id,
        filter: sortType,
        list_id: listID,
      }),
    {
      enabled: id > 0,
    },
  );
};

export const useTasksFillStartdate = () =>
  useQuery('autofill', () => getTasksFillStartdate(), {
    refetchInterval: 5 * 60 * 1000,
  });

export {
  useTasksList,
  useTaskDetail,
  useTasksForCalendar,
  useTasksForKeyword,
  useTasksADay,
  useTasksAll,
  useTasksRequest,
  useTasksRequested,
};
