import { ReactElement } from 'react';
import HomeLayout from '@component/layout/HomeLayout';

const Tasks = () => {
  return null;
};

export default Tasks;

Tasks.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>;
};
