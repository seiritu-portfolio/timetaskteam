import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import axiosConfig from '@util/axiosConfig';
import { configBearerToken } from '@util/constants';
import {
  URL_BULK_UPDATE,
  URL_TASK,
  URL_TASKS_SORT_UPDATE,
  URL_TASK_COPY,
  URL_TASK_DETAIL,
  URL_TASK_OPTIONAL_DETAIL,
  URL_TASK_PIVOT_DETAIL,
  URL_TASK_REPETITION,
} from '@util/urls';

export const useTaskAddMutation = (callbackFn: (data: any) => void) => {
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data) => {
      // return axiosConfig.post(`${URL_TASK}?user_id=${data.user_id}`, data, {
      return axiosConfig.post(URL_TASK, data, {
        ...configBearerToken(token ?? ''),
      });
    },
    {
      onSuccess: async (data) => {
        callbackFn(data.data);
        queryClient.invalidateQueries('tasks');
        queryClient.invalidateQueries('rates');
      },
      onError: async () => {},
    },
  );
};

export const useTaskUpdateMutation = (
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
        URL_TASK_DETAIL.replace(/\%s/g, id.toString()),
        data,
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async (data) => {
        callbackFn(data.data);
        queryClient.invalidateQueries('tasks');
        queryClient.invalidateQueries('rates');
      },
      onError: async () => {},
    },
  );
};

export const useTaskRepetitionMutation = (callbackFn?: (_: any) => void) => {
  const [token, setToken] = useState<string | null>(null);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data: any) => {
      return axiosConfig.post(URL_TASK_REPETITION, data, {
        ...configBearerToken(token ?? ''),
      });
    },
    {
      onSuccess: async (data) => {
        if (callbackFn) {
          callbackFn(data.data);
        }
        queryClient.invalidateQueries('tasks');
        queryClient.invalidateQueries('rates');
      },
      onError: async (err) => {
        console.log('error', err);
      },
    },
  );
};

export const useTaskUpdateForSort = (callbackFn: (data: any) => void) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    setToken(localStorage.getItem('task3_token'));
  }, [token]);

  return useMutation(
    ({ id, object }: { id: number; object: any }) => {
      return axiosConfig.put(
        URL_TASK_OPTIONAL_DETAIL.replace(/\%s/g, id.toString()),
        object,
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async (response) => {
        queryClient.invalidateQueries('list');
        queryClient.invalidateQueries('tasks');
        callbackFn(response);
      },
      onError: async () => {
        console.log('error occured');
        queryClient.invalidateQueries('list');
        queryClient.invalidateQueries('tasks');
      },
    },
  );
};

export const useBulkTasksUpdate = (callbackFn: () => void) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data: any) => {
      return axiosConfig.post(URL_BULK_UPDATE, data, {
        ...configBearerToken(token ?? ''),
      });
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('list');
        queryClient.invalidateQueries('tasks');
        callbackFn();
      },
      onError: async () => {},
    },
  );
};

export const useCompleteTask = (callbackFn?: (data: any) => void) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    ({ id, completed }: { id: number; completed: number }) => {
      return axiosConfig.put(
        URL_TASK_PIVOT_DETAIL.replace(/\%s/g, id.toString()),
        {
          completed,
        },
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async (data) => {
        if (callbackFn) {
          callbackFn(data);
        }
        queryClient.invalidateQueries('tasks');
        queryClient.invalidateQueries('list');
        queryClient.invalidateQueries('rates');
      },
      onError: async () => {},
    },
  );
};

export const useTaskSortUpdate = (callbackFn: () => void) => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data: any) =>
      axiosConfig.post(
        URL_TASKS_SORT_UPDATE,
        {
          data,
        },
        {
          ...configBearerToken(token ?? ''),
        },
      ),
    {
      onSuccess: async () => {
        callbackFn();
      },
      onError: async () => {},
    },
  );
};

export const useTaskDelete = (id: number, callbackFn: () => void) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    () => {
      return axiosConfig.delete(
        URL_TASK_DETAIL.replace(/\%s/g, id.toString()),
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async () => {
        setTimeout(() => {
          queryClient.invalidateQueries('tasks');
        }, 100);
        callbackFn();
      },
    },
  );
};

export const useTaskDeleteWithID = (callbackFn?: () => void) => {
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
        URL_TASK_DETAIL.replace(/\%s/g, id.toString()),
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('tasks');
        if (callbackFn) callbackFn();
      },
    },
  );
};

export const useTaskCopyMutation = (callbackFn: (data: any) => void) => {
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
        URL_TASK_COPY,
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
            queryClient.invalidateQueries('tasks');
            queryClient.invalidateQueries('rates');
            callbackFn(data.data);
          },
        });
      },
      onError: async () => {},
    },
  );
};
