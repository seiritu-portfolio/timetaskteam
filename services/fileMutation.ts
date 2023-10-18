import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import axiosConfig from '@util/axiosConfig';
import { configBearerToken, GENERAL_MESSAGES } from '@util/constants';
import { URL_FILES } from '@util/urls';

const useFileUploadMutation = (callbackFn: (response: any) => void) => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage) {
      setToken(localStorage.getItem('task3_token'));
    }
  }, [token]);

  return useMutation(
    (files: any[]) => {
      const fd = new FormData();

      [...files].forEach((file) => {
        fd.append('files[]', file);
      });
      const token = localStorage.getItem('task3_token');
      const config = configBearerToken(token ?? '');

      return axiosConfig.post(URL_FILES, fd, config);
    },
    {
      onSuccess: async (data) => {
        callbackFn(data.data);
      },
      onError: async () => {
        toast.error(GENERAL_MESSAGES.FILE_UPLOAD_FAILED);
      },
    },
  );
};

export default useFileUploadMutation;
