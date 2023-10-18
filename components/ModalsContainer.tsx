import { useDispatch, useSelector } from 'react-redux';
// * hooks
import { userInfoSelector } from '@store/selectors/user';
import {
  settingsModalStatusSelector,
  contactusModalStatusSelector,
  policiesModalStatusSelector,
  taskModalStatusSelector,
  scheduleModalStatusSelector,
  listAddModalStatusSelector,
  listEditModalStatusSelector,
  noteModalStatusSelector,
} from '@store/selectors/home';
import {
  setContactusModalStatus,
  setListAddModal,
  setListEditModal,
  setModalUrl,
  setNoteModalStatus,
  setPoliciesModalStatus,
  setScheduleModalStatus,
  setSettingsModalStatus,
  setTaskModalStatus,
} from '@store/modules/home';
// * components
import SettingsModal from '@component/settings/SettingsModal';
import ModalContactus from '@component/ModalContactus';
import ModalPolicies from '@component/ModalPolicies';
import ModalTask from '@component/home/ModalTask';
import ModalAddNote from '@component/note/add';
import ModalImage from '@component/ModalImage';
import ModalSchedule from './home/schedule/ModalSchedule';
import ModalAddList from './list/ModalAddList';
import ModalNoteEditList from './list/ModalNoteEditList';
// * utils & constants
import { replaceState } from '@util/replaceUrl';
import { NOTES_URL, TASKS_URL } from '@util/urls';

const ModalsContainer = () => {
  const user = useSelector(userInfoSelector);
  const dispatch = useDispatch();
  const isOpenSettingsModal = useSelector(settingsModalStatusSelector);
  const isOpenModalContactus = useSelector(contactusModalStatusSelector);
  const isOpenModalPolicies = useSelector(policiesModalStatusSelector);
  const isOpenTaskModal = useSelector(taskModalStatusSelector);
  const isOpenScheduleModal = useSelector(scheduleModalStatusSelector);
  const isOpenListAddModal = useSelector(listAddModalStatusSelector);
  const isOpenListEditModal = useSelector(listEditModalStatusSelector);
  const isOpenNoteModal = useSelector(noteModalStatusSelector);

  return (
    <>
      <SettingsModal
        isOpen={user.user != null && isOpenSettingsModal}
        close={() => {
          dispatch(setSettingsModalStatus(false));
          // * get saved background url and set it to window url
          const backgroundUrl =
            localStorage.getItem('task3_background_url') ?? TASKS_URL;
          replaceState(backgroundUrl);
          dispatch(setModalUrl(''));
        }}
      />
      <ModalContactus
        isOpen={user.user != null && isOpenModalContactus}
        close={() => {
          dispatch(setContactusModalStatus(false));
          const backgroundUrl =
            localStorage.getItem('task3_background_url') ?? TASKS_URL;
          replaceState(backgroundUrl);
        }}
      />
      <ModalPolicies
        isOpen={user.user != null && isOpenModalPolicies}
        close={() => {
          dispatch(setPoliciesModalStatus(false));
          const backgroundUrl =
            localStorage.getItem('task3_background_url') ?? TASKS_URL;
          replaceState(backgroundUrl);
        }}
      />
      <ModalTask
        isOpen={user.user != null && isOpenTaskModal}
        close={() => {
          dispatch(setTaskModalStatus(false));
          const backgroundUrl =
            localStorage.getItem('task3_background_url') ?? TASKS_URL;
          replaceState(backgroundUrl);
        }}
      />
      <ModalSchedule
        isOpen={user.user != null && isOpenScheduleModal}
        close={() => {
          dispatch(setScheduleModalStatus(false));
          const backgroundUrl =
            localStorage.getItem('task3_background_url') ?? TASKS_URL;
          replaceState(backgroundUrl);
        }}
      />
      <ModalAddList
        isOpen={isOpenListAddModal}
        close={() => {
          dispatch(setListAddModal(false));
          const backgroundUrl =
            localStorage.getItem('task3_background_url') ?? TASKS_URL;
          replaceState(backgroundUrl);
        }}
      />
      <ModalNoteEditList
        isOpen={isOpenListEditModal}
        close={() => {
          dispatch(setListEditModal(false));
        }}
      />
      <ModalAddNote
        isOpen={isOpenNoteModal}
        close={() => {
          const backgroundUrl =
            localStorage.getItem('task3_background_url') ?? NOTES_URL;
          replaceState(backgroundUrl);
          dispatch(setNoteModalStatus(false));
        }}
      />
      <ModalImage />
    </>
  );
};

export default ModalsContainer;
