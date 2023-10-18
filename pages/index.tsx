import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { SIGNIN_URL, TASKS_ALL_URL } from '@util/urls';

const Home: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    const savedToken = localStorage.getItem('task3_token');

    if (!savedToken || savedToken == 'null' || savedToken == '') {
      router.push(SIGNIN_URL);
    } else {
      router.push(TASKS_ALL_URL);
    }
  }, [router]);

  return null;
};

export default Home;
