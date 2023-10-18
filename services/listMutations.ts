import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import axiosConfig from '@util/axiosConfig';
import { configBearerToken } from '@util/constants';
import {
  URL_LISTS,
  URL_LIST_ARCHIVE,
  URL_LIST_OPERATION,
  URL_LIST_UNARCHIVE,
  URL_LIST_SORT_UPDATE,
  URL_LIST_EXIT,
} from '@util/urls';
import { setCurrentListID } from '@store/modules/list';

export const useDeleteList = (id: number, callbackFn: () => void) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    () => {
      return axiosConfig.delete(
        URL_LIST_OPERATION.replace(/\%s/g, id.toString()),
        { ...configBearerToken(token ?? '') },
      );
    },
    {
      onSuccess: async () => {
        dispatch(setCurrentListID(-1));

        toast.success('成功', {
          hideProgressBar: true,
          progress: undefined,
          onOpen: () => {
            queryClient.invalidateQueries('list');
          },
          onClose: () => {
            callbackFn();
          },
        });
      },
      onError: async () => {},
    },
  );
};

export const useDeleteListByID = (callbackFn: () => void) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (id: number) => {
      return axiosConfig.delete(
        URL_LIST_OPERATION.replace(/\%s/g, id.toString()),
        { ...configBearerToken(token ?? '') },
      );
    },
    {
      onSuccess: async () => {
        dispatch(setCurrentListID(-1));

        toast.success('成功', {
          hideProgressBar: true,
          progress: undefined,
          onOpen: () => {
            queryClient.invalidateQueries('list');
          },
          onClose: () => {
            callbackFn();
          },
        });
      },
      onError: async () => {},
    },
  );
};

export const useArchiveList = (id: number, callbackFn: () => void) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    () => {
      return axiosConfig.put(
        URL_LIST_ARCHIVE.replace(/\%s/g, id.toString()),
        {},
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async () => {
        dispatch(setCurrentListID(-1));
        toast.success('成功', {
          hideProgressBar: true,
          progress: undefined,
          onOpen: () => {
            queryClient.invalidateQueries('list');
          },
          onClose: () => {
            callbackFn();
          },
        });
      },
      onError: async (error) => {
        console.log(error);
      },
    },
  );
};

export const useUnarchiveList = (id: number, callbackFn: () => void) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    () => {
      return axiosConfig.put(
        URL_LIST_UNARCHIVE.replace(/\%s/g, id.toString()),
        {},
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async () => {
        dispatch(setCurrentListID(-1));
        toast.success('成功', {
          hideProgressBar: true,
          progress: undefined,
          onOpen: () => {
            queryClient.invalidateQueries('list');
          },
          onClose: () => {
            callbackFn();
          },
        });
      },
      onError: async (error) => {
        console.log(error);
      },
    },
  );
};

export const useAddList = (callbackFn: () => void) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data: any) => {
      const token = localStorage.getItem('task3_token');
      const config = configBearerToken(token ?? '');

      return axiosConfig.post(URL_LISTS, data, config);
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('list');
        toast.success('成功', {
          hideProgressBar: false,
          progress: undefined,
          onOpen: () => {
            callbackFn();
          },
        });
      },
      onError: async (error) => {
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

export const useListSortUpdate = (callbackFn: () => void) => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data: any) =>
      axiosConfig.post(
        URL_LIST_SORT_UPDATE,
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

export const useListExit = (id: number, callbackFn?: (_: any) => void) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    () => {
      return axiosConfig.delete(URL_LIST_EXIT.replace(/\%s/g, id.toString()), {
        ...configBearerToken(token ?? ''),
      });
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('list');
        if (callbackFn) callbackFn(true);
      },
    },
  );
};

export const useListUpdate = (callbackFn?: (_: any) => void) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data: any) => {
      return axiosConfig.put(
        URL_LIST_OPERATION.replace(/\%s/g, (data?.id ?? 0).toString()),
        data,
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async (_) => {
        queryClient.invalidateQueries('list');
        toast.success('成功', {
          hideProgressBar: false,
          progress: undefined,
          onOpen: () => {
            if (callbackFn) callbackFn(_);
          },
        });
      },
      onError: async (error) => {
        console.log('error', error);
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
