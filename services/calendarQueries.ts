import { useQuery } from 'react-query';
import axiosConfig from '@util/axiosConfig';
import { configBearerToken } from '@util/constants';
import { URL_CALENDAR_LIST, URL_HOLIDAYS } from '@util/urls';

const getHolidays = async () => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(URL_HOLIDAYS, config);
  return data;
};

const getCalendarList = async () => {
  const token = localStorage.getItem('task3_token');

  const config = configBearerToken(token ?? '');

  const { data } = await axiosConfig.get(URL_CALENDAR_LIST, config);
  return data;
};

const useHolidays = () => useQuery('holidays', () => getHolidays());
const useCalendarsList = (isEnabled: boolean) =>
  useQuery('calendars', () => getCalendarList(), {
    enabled: isEnabled,
  });

export default useHolidays;

export { useCalendarsList };
