import { useQuery } from 'react-query';

import axiosConfig from '@util/axiosConfig';
import { configBearerToken } from '@util/constants';
import { URL_LISTS, URL_LISTS_FOR_USER, URL_LIST_OPERATION } from '@util/urls';

const LIST_TYPE_ARRAY = ['task', 'schedule', 'note'];

const getListArrayByType = async (type: number, isArchived: boolean) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');
  const params = {
    type: LIST_TYPE_ARRAY[type],
    archived: isArchived,
  };

  const { data } = await axiosConfig.get(URL_LISTS, {
    params,
    ...config,
  });

  return data;
};

const getListArrayByTypeForUser = async (
  id: number,
  type: number,
  isArchived: boolean,
) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const params = {
    type: LIST_TYPE_ARRAY[type],
    archived: isArchived,
  };

  const { data } = await axiosConfig.get(
    URL_LISTS_FOR_USER.replace(/\%s/g, id.toString()),
    {
      params,
      ...config,
    },
  );

  return data;
};

const getListArrayAll = async () => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(URL_LISTS, { ...config });
  return data;
};

const getListArrayAllForUser = async (id: number) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(
    URL_LISTS_FOR_USER.replace(/\%s/g, id.toString()),
    { ...config },
  );
  return data;
};

const getListDetail = async (listID: number) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(
    URL_LIST_OPERATION.replace(/\%s/g, listID.toString()),
    {
      params: {
        id: listID,
      },
      ...config,
    },
  );

  return data;
};

const getListDetailForUser = async (id: number, listID: number) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(
    URL_LIST_OPERATION.replace(/\%s/g, listID.toString()),
    {
      params: {
        user_id: id,
        id: listID,
      },
      ...config,
    },
  );

  return data;
};

const useListArrayAll = () => {
  return useQuery(['list', { type: 'all' }], () => getListArrayAll());
};

export const useListArrayAllForUser = (id: number) => {
  return useQuery(
    ['list', { id, type: 'all' }],
    () => getListArrayAllForUser(id),
    {
      enabled: id > 0,
    },
  );
};

const useListArrayByType = (type: number, isArchived: boolean) => {
  return useQuery(
    [
      'list',
      {
        type,
        isArchived,
      },
    ],
    () => getListArrayByType(type, isArchived),
  );
};

export const useListArrayByTypeForUser = (
  id: number,
  type: number,
  isArchived: boolean,
) => {
  return useQuery(
    [
      'list',
      {
        id,
        type,
        isArchived,
      },
    ],
    () => getListArrayByTypeForUser(id, type, isArchived),
    {
      enabled: id > 0,
    },
  );
};

const useListDetail = (id: number | null) => {
  return useQuery(
    [
      'list',
      {
        id,
      },
    ],
    () => getListDetail(id ?? 0),
    {
      enabled: id != null && id > 0,
    },
  );
};

export const useListDetailForUser = (userId: number, id: number | null) => {
  return useQuery(
    [
      'list',
      {
        userId,
        id,
      },
    ],
    () => getListDetailForUser(userId, id ?? 0),
    {
      enabled: id != null && id > 0 && userId > 0,
    },
  );
};

export { useListArrayByType, useListDetail, useListArrayAll };
