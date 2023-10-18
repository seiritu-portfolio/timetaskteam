import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import {
  URL_SCHEDULE,
  URL_SCHEDULE_COPY,
  URL_SCHEDULE_DELTAUPDATE,
  URL_SCHEDULE_DETAIL,
  URL_SCHEDULE_OPTIONAL_DETAIL,
  URL_SCHEDULE_REPETITION,
} from '@util/urls';
import axiosConfig from '@util/axiosConfig';
import { configBearerToken } from '@util/constants';

export const useScheduleAdd = (callbackFn: (_: any) => void) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data: any) => {
      return axiosConfig.post(URL_SCHEDULE, data, {
        ...configBearerToken(token ?? ''),
      });
    },
    {
      onSuccess: async (_) => {
        queryClient.invalidateQueries('schedules');
        callbackFn(_);
        // toast.success('成功', {
        //   hideProgressBar: false,
        //   progress: undefined,
        //   onOpen: () => {
        //   },
        // });
      },
      onError: async (error) => {
        // @ts-ignore
        console.log('error', Object.values(error.response.data.errors)[0]);
        // @ts-ignore
        const errorMessage = error.response.data.data
          ? // @ts-ignore
            error.response.data.data
          : // @ts-ignore
            Object.values(error.response.data.errors)[0][0];
        toast.error(errorMessage, {
          hideProgressBar: false,
          progress: undefined,
        });
      },
    },
  );
};

export const useScheduleUpdateMutation = (
  id: number,
  callbackFn: (data: any) => void,
) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data) => {
      return axiosConfig.put(
        URL_SCHEDULE_DETAIL.replace(/\%s/g, id.toString()),
        data,
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async (data) => {
        callbackFn(data.data);
        queryClient.invalidateQueries('schedules');
      },
      onError: async () => {},
    },
  );
};

export const useScheduleOptionalUpdateMutation = (
  callbackFn?: (data: any) => void,
) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    setToken(localStorage.getItem('task3_token'));
  }, [token]);

  return useMutation(
    ({ id, object }: { id: number; object: any }) => {
      return axiosConfig.put(
        URL_SCHEDULE_OPTIONAL_DETAIL.replace(/\%s/g, id.toString()),
        object,
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async (response) => {
        // queryClient.invalidateQueries('list');
        queryClient.invalidateQueries('schedules');
        if (callbackFn) callbackFn(response);
      },
      onError: async () => {},
    },
  );
};

export const useScheduleRepetitionMutation = (
  callbackFn?: (_: any) => void,
) => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);
  const queryClient = useQueryClient();

  return useMutation(
    (data: any) => {
      return axiosConfig.post(URL_SCHEDULE_REPETITION, data, {
        ...configBearerToken(token ?? ''),
      });
    },
    {
      onSuccess: async (data) => {
        if (callbackFn) {
          callbackFn(data.data);
        }
        queryClient.invalidateQueries('schedules');
      },
      onError: async (err) => {
        console.log('error', err);
      },
    },
  );
};

export const useScheduleDelete = (callbackFn?: () => void) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (id: number) => {
      return axiosConfig.delete(
        URL_SCHEDULE_DETAIL.replace(/\%s/g, id.toString()),
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async () => {
        setTimeout(() => {
          queryClient.invalidateQueries('schedules');
        }, 100);
        if (callbackFn) callbackFn();
      },
    },
  );
};

export const useScheduleCopyMutation = (callbackFn: (data: any) => void) => {
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    ({ id, delta }: { id: number; delta: number }) => {
      return axiosConfig.post(
        URL_SCHEDULE_COPY,
        {
          id,
          delta,
        },
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async (data) => {
        toast.success('成功', {
          hideProgressBar: true,
          progress: undefined,
          onOpen: () => {
            queryClient.invalidateQueries('schedules');
            callbackFn(data.data);
          },
        });
      },
      onError: async () => {},
    },
  );
};

export const useScheduleDeltaUpdateMutation = (callbackFn?: () => void) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    ({
      id,
      delta,
      deltaMins,
    }: {
      id: number;
      delta?: number;
      deltaMins?: number;
    }) => {
      return axiosConfig.post(
        URL_SCHEDULE_DELTAUPDATE,
        {
          id,
          delta,
          delta_mins: deltaMins,
        },
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async (data) => {
        queryClient.invalidateQueries('schedules');
        if (callbackFn) {
          callbackFn();
        }
      },
      onError: async () => {},
    },
  );
};

export const useScheduleMinsCopyMutation = (
  callbackFn?: (data: any) => void,
) => {
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    ({ id, deltaMins }: { id: number; deltaMins: number }) => {
      return axiosConfig.post(
        URL_SCHEDULE_COPY,
        {
          id,
          delta_mins: deltaMins,
        },
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async (data) => {
        toast.success('成功', {
          hideProgressBar: true,
          progress: undefined,
          onOpen: () => {
            queryClient.invalidateQueries('schedules');
            if (callbackFn) callbackFn(data.data);
          },
        });
      },
      onError: async () => {},
    },
  );
};
