import { useQuery } from 'react-query';
import axiosConfig from '@util/axiosConfig';
import { configBearerToken } from '@util/constants';
import { URL_GROUP } from '@util/urls';

const getGroups = async () => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(URL_GROUP, config);
  return data;
};

const getGroupDetail = async (id: number) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');
  const urlGroupDetail = `${URL_GROUP}/${id}`;

  const { data } = await axiosConfig.get(urlGroupDetail, config);
  return data;
};

const useGroups = () => useQuery('groups', () => getGroups());

const useGroupDetail = (id: number) =>
  useQuery(['groups', id], () => getGroupDetail(id));

export { useGroups, useGroupDetail };
