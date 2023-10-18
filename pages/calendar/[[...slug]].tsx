import { ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { today } from '@store/modules/calendar';
import CalendarLayout from '@component/layout/CalendarLayout';
import Calendar from '@component/calendar';

const CalendarDetail = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(today())
  }, [dispatch]);

  return <Calendar className={'flex flex-col'} />;
};

export default CalendarDetail;

CalendarDetail.getLayout = function getLayout(page: ReactElement) {
  return <CalendarLayout>{page}</CalendarLayout>;
};
