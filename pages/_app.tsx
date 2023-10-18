import { ReactElement, ReactNode, useEffect } from 'react';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useDispatch, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
require('dayjs/locale/ja');
import updateLocale from 'dayjs/plugin/updateLocale';
import { useHotkeys } from 'react-hotkeys-hook';
// * hooks
import {
  settingsModalStatusSelector,
  modalUrlSelector,
  contactusModalStatusSelector,
  policiesModalStatusSelector,
  listModalStatusSelector,
  listAddModalStatusSelector,
} from '@store/selectors/home';
import { userInfoSelector } from '@store/selectors/user';
import {
  setCodisplayUsers,
  setCurrentCodisplayUser,
  setListModal,
} from '@store/modules/home';
import { wrapper } from '@store/index';
import { replaceState } from '@util/replaceUrl';
// * components
import ModalsContainer from '@component/ModalsContainer';
import ModalList from '@component/list/ModalList';
import DragDrop from '@component/DragDrop';
import HotKeysController from '@service/hooks/hotkey';
// * import css
import '../styles/globals.css';
import 'react-responsive-modal/styles.css';
import {
  CONTACTUS_URL,
  LIST_ADD_URL,
  LIST_URL,
  POLICIES_URL,
  RESET_PASSWORD_URL,
  SETTINGS_URL,
  SIGNIN_URL,
  TASKS_URL,
} from '@util/urls';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5000,
    },
  },
});
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();
  const dispatch = useDispatch();

  const isOpenSettingsModal = useSelector(settingsModalStatusSelector);
  const isOpenModalContactus = useSelector(contactusModalStatusSelector);
  const isOpenModalPolicies = useSelector(policiesModalStatusSelector);
  const isOpenListModal = useSelector(listModalStatusSelector);
  const isOpenListAddModal = useSelector(listAddModalStatusSelector);
  const modalUrl = useSelector(modalUrlSelector);

  // * react-toastify css style
  useEffect(() => {
    injectStyle();
    dayjs.locale('ja');
    dayjs.extend(timezone);
    dayjs.extend(updateLocale);
  }, []);
  // * prevent default shortcut key behavior
  useHotkeys(['alt+f'], (event: any) => {
    event.preventDefault();
  });

  const { user } = useSelector(userInfoSelector);
  useEffect(() => {
    if (user) {
      dispatch(setCodisplayUsers([user.id]));
      dispatch(setCurrentCodisplayUser(user.id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    const savedToken = localStorage.getItem('task3_token');
    const currentRoute = router.asPath;

    if (
      (!savedToken || savedToken == '' || savedToken == 'null') &&
      !currentRoute.includes(SIGNIN_URL) &&
      !currentRoute.includes(RESET_PASSWORD_URL)
    ) {
      router.push(SIGNIN_URL);
    }
  }, [router]);

  useEffect(() => {
    if (isOpenSettingsModal && !router.asPath.includes(SETTINGS_URL)) {
      replaceState(modalUrl !== '' ? modalUrl : SETTINGS_URL);
    } else if (isOpenModalContactus && !router.asPath.includes(CONTACTUS_URL)) {
      replaceState(CONTACTUS_URL);
      // replaceState(modalUrl !== '' ? modalUrl : '');
    } else if (isOpenModalPolicies && !router.asPath.includes(POLICIES_URL)) {
      replaceState(POLICIES_URL);
    } else if (isOpenListAddModal && !router.asPath.includes(LIST_ADD_URL)) {
      replaceState(LIST_ADD_URL);
    } else if (isOpenListModal && router.asPath !== LIST_URL) {
      replaceState(LIST_URL);
    }
  }, [
    isOpenSettingsModal,
    isOpenModalContactus,
    isOpenModalPolicies,
    isOpenListAddModal,
    isOpenListModal,
    router.asPath,
    modalUrl,
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <DragDrop>
        {getLayout(<Component {...pageProps} />)}
        <ModalList
          isOpen={isOpenListModal}
          close={() => {
            dispatch(setListModal(false));
            const backgroundUrl =
              localStorage.getItem('task3_background_url') ?? TASKS_URL;
            replaceState(backgroundUrl);
          }}
        />
      </DragDrop>
      <ModalsContainer />
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
      <ToastContainer
        style={{
          zIndex: 10001,
        }}
      />
      <HotKeysController />
    </QueryClientProvider>
  );
}

export default wrapper.withRedux(MyApp);
