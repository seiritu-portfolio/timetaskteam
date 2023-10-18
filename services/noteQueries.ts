import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import axiosConfig from '@util/axiosConfig';
import { configBearerToken } from '@util/constants';
import {
  URL_LISTS_FOR_USER,
  URL_NOTE,
  URL_NOTE_CHECK,
  URL_NOTE_DETAIL,
} from '@util/urls';

const getNoteLists = async (userId: number) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const params = {
    type: 'note',
    archived: false,
  };
  const { data } = await axiosConfig.get(
    URL_LISTS_FOR_USER.replace(/\%s/g, userId.toString()),
    {
      params,
      ...config,
    },
  );
  return data;
};

const getNotesList = async ({
  list_id,
  user_ids,
  search,
}: {
  list_id?: number;
  user_ids?: number[];
  search?: string;
}) => {
  const token = localStorage.getItem('task3_token');
  const config = configBearerToken(token ?? '');

  const params: any = {};
  if (list_id) {
    params['list_id'] = list_id;
  }
  if (user_ids) {
    params['user_ids'] = user_ids;
  }
  if (search && search !== '') {
    params['keyword'] = search;
  }
  const { data } = await axiosConfig.get(URL_NOTE, {
    params,
    ...config,
  });
  return data;
};

const useNoteListsForUser = ({ user_id }: { user_id: number }) => {
  return useQuery(
    [
      'list',
      {
        id: user_id,
        type: 'note',
        isArchived: false,
      },
    ],
    () => getNoteLists(user_id),
    {
      enabled: user_id > 0,
    },
  );
};

const useNotesForUsers = ({
  list_id,
  user_ids,
  search,
}: {
  list_id: number;
  user_ids: number[];
  search: string;
}) =>
  useQuery(
    [
      'notes',
      {
        filter: 'list',
        user_ids,
        list_id,
        search,
      },
    ],
    () =>
      getNotesList({
        list_id,
        user_ids,
        search,
      }),
    {
      enabled:
        (user_ids.length > 1 || (user_ids.length === 1 && user_ids[0] !== 0)) &&
        list_id > 0,
    },
  );

const useAllNotesForUsers = ({
  user_ids,
  search,
}: {
  user_ids: number[];
  search: string;
}) =>
  useQuery(
    [
      'notes',
      {
        filter: 'list',
        user_ids,
        search,
      },
    ],
    () => getNotesList({ user_ids, search }),
    {
      enabled:
        user_ids.length > 1 || (user_ids.length === 1 && user_ids[0] !== 0),
    },
  );

const useNoteAddMutation = (callbackFn: (data: any) => void) => {
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (data: any) => {
      return axiosConfig.post(URL_NOTE, data, {
        ...configBearerToken(token ?? ''),
      });
    },
    {
      onSuccess: async (data) => {
        queryClient.invalidateQueries('notes');
        callbackFn(data.data);
      },
      onError: async () => {},
    },
  );
};

const useNoteCheckMutation = (
  userId: number,
  callbackFn?: (data: any) => void,
) => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (noteId: number) => {
      return axiosConfig.post(
        URL_NOTE_CHECK.replace(/\%s/g, noteId.toString()),
        {
          user: userId,
        },
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async (_) => {
        if (callbackFn) callbackFn(_.data);
      },
      onError: async () => {},
    },
  );
};

const useNoteUpdateMutation = (id: number, callbackFn: (data: any) => void) => {
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
        URL_NOTE_DETAIL.replace(/\%s/g, id.toString()),
        data,
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async (data) => {
        queryClient.invalidateQueries('notes');
        callbackFn(data.data);
      },
      onError: async () => {},
    },
  );
};

const useNoteDeleteWithID = (callbackFn?: () => void) => {
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
        URL_NOTE_DETAIL.replace(/\%s/g, id.toString()),
        {
          ...configBearerToken(token ?? ''),
        },
      );
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('notes');
        if (callbackFn) callbackFn();
      },
    },
  );
};

export {
  useNoteListsForUser,
  useNotesForUsers,
  useAllNotesForUsers,
  useNoteAddMutation,
  useNoteUpdateMutation,
  useNoteDeleteWithID,
  useNoteCheckMutation,
};
