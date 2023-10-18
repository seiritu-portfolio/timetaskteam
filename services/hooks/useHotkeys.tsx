import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';
// * hooks
import {
  setCodisplayFetching,
  setCurrentCodisplayUser,
  setModalUrl,
  setNoteModalStatus,
  setScheduleModalStatus,
  setSettingsModalStatus,
  setTaskModalStatus,
  toggleIsOnSearch,
} from '@store/modules/home';
import {
  setCurrentTask,
  setShowTaskDetail,
  setTaskID,
} from '@store/modules/tasks';
import { setViewMode } from '@store/modules/calendar';
import { setCurrentSchedule, setScheduleID } from '@store/modules/schedules';
import { setCurrentNoteID } from '@store/modules/list';
import { viewModeSelector } from '@store/selectors/calendar';
import { membersSelector } from '@store/selectors/collabos';
import { userInfoSelector } from '@store/selectors/user';
import { currentCodisplayUserSelector } from '@store/selectors/home';
// * utils
import { replaceState } from '@util/replaceUrl';
// * constants
import {
  CALENDAR_URL,
  NOTE_ADD_URL,
  NOTE_ALL_URL,
  SCHEDULE_ADD_URL,
  SETTINGS_URL,
  TASKS_ALL_URL,
  TASK_ADD_URL,
} from '@util/urls';

const useHotkeys = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const currentViewMode = useSelector(viewModeSelector);
  const members = useSelector(membersSelector);
  const myInfo = useSelector(userInfoSelector);
  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);

  const membersWithMe = useMemo(() => {
    if (myInfo.user) {
      return [
        {
          id: myInfo.user.id,
          avatar: myInfo.user.avatar,
          pivot: {
            color: 4,
          },
        },
        ...members,
      ];
    } else {
      return [...members];
    }
  }, [members, myInfo.user]);

  const switchMember = useCallback(
    (isNext: boolean) => {
      let currentIndex = 0;
      for (let i = 0; i < membersWithMe.length; i++) {
        const item = membersWithMe[i];
        if (currentCodisplayUserID == item.id) {
          currentIndex = i;
          break;
        }
      }
      let newIndex = 0;
      if (isNext) {
        newIndex = (currentIndex + 1) % membersWithMe.length;
      } else {
        newIndex =
          (currentIndex + membersWithMe.length - 1) % membersWithMe.length;
      }
      dispatch(setCurrentCodisplayUser(membersWithMe[newIndex].id));
      dispatch(setCodisplayFetching(true));
      dispatch(setShowTaskDetail(false));
      queryClient.invalidateQueries('tasks');
      queryClient.invalidateQueries('list');
    },
    [dispatch, membersWithMe, currentCodisplayUserID, queryClient],
  );
  const changeViewMode = useCallback(
    (newViewMode, oldViewMode) => {
      if (newViewMode !== oldViewMode) {
        dispatch(setViewMode(newViewMode));
      }
    },
    [dispatch],
  );

  const onKeyHandler = useCallback(
    (currentAction: string, currentSubaction: string | undefined) => {
      if (currentAction === 'screen') {
        const newUrl =
          currentSubaction === 'task'
            ? TASKS_ALL_URL
            : currentSubaction === 'settings'
            ? SETTINGS_URL
            : currentSubaction === 'calendar'
            ? CALENDAR_URL
            : NOTE_ALL_URL;
        router.push(newUrl);
      } else if (currentAction === 'switch') {
        // ! this case, switch member
        switchMember(currentSubaction == 'after');
      } else if (currentAction === 'modal') {
        const currentUrl = router.asPath;
        localStorage.setItem('task3_background_url', currentUrl);
        if (currentSubaction === 'newSchedule') {
          replaceState(SCHEDULE_ADD_URL);
          dispatch(setScheduleID(-1));
          dispatch(setCurrentSchedule(null));
          dispatch(setScheduleModalStatus(true));
        } else if (currentSubaction === 'newTask') {
          replaceState(TASK_ADD_URL);
          dispatch(setTaskID(-1));
          dispatch(setCurrentTask(null));
          dispatch(setTaskModalStatus(true));
        } else if (currentSubaction === 'newNote') {
          replaceState(NOTE_ADD_URL);
          dispatch(setCurrentNoteID(-1));
          dispatch(setNoteModalStatus(true));
        } else if (currentSubaction === 'settings') {
          dispatch(setModalUrl(SETTINGS_URL));
          replaceState(SETTINGS_URL);
          dispatch(setSettingsModalStatus(true));
        }
      } else if (currentAction === 'search') {
        dispatch(toggleIsOnSearch());
      } else {
        changeViewMode(currentAction, currentViewMode);
      }
    },
    [currentViewMode, changeViewMode, router, switchMember, dispatch],
  );

  return onKeyHandler;
};

export default useHotkeys;
