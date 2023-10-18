import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-responsive-modal';
import Draggable from 'react-draggable';
// * hooks
import {
  currentScheduleIDSelector,
  currentScheduleSelector,
} from '@store/selectors/schedules';
import { useScheduleDetailForUser } from '@service/scheduleQueries';
import { setCurrentSchedule, setScheduleID } from '@store/modules/schedules';
import { setScheduleModalStatus } from '@store/modules/home';
import {
  currentCodisplayUserSelector,
  onCodisplaySelector,
} from '@store/selectors/home';
import { userIDSelectedSelector } from '@store/selectors/calendar';
// * custom components
import ScheduleAdd from './ScheduleAdd';
import ScheduleDetail from './ScheduleDetail';
// * assets
import ModalDefaultProps from '@model/modal';
import { CALENDAR_URL } from '@util/urls';

const ModalSchedule = ({ isOpen, close }: ModalDefaultProps) => {
  const scheduleID = useSelector(currentScheduleIDSelector);

  const [isFetching, setIsFetching] = useState(false);
  const onCodisplayMode = useSelector(onCodisplaySelector);
  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);
  const userIDSelected = useSelector(userIDSelectedSelector);

  const [isCalendar, setIsCalendar] = useState(false);
  useEffect(() => {
    const backgroundUrl = localStorage.getItem('task3_background_url') ?? '';
    setIsCalendar(backgroundUrl.includes(CALENDAR_URL));
  }, []);

  const currentUserID = useMemo(() => {
    const selectedUserID =
      !userIDSelected || userIDSelected < 1
        ? currentCodisplayUserID
        : userIDSelected;
    const id =
      onCodisplayMode || isCalendar ? selectedUserID : currentCodisplayUserID;
    return id;
  }, [onCodisplayMode, currentCodisplayUserID, userIDSelected, isCalendar]);
  const currentScheduleResult = useScheduleDetailForUser(
    currentUserID,
    scheduleID,
    isFetching,
  );

  useEffect(() => {
    if (currentScheduleResult.status == 'loading') {
      setIsFetching(true);
    } else {
      setIsFetching(false);
    }
  }, [currentScheduleResult.status]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (currentScheduleResult.isSuccess) {
      dispatch(setCurrentSchedule(currentScheduleResult.data));
    }
  }, [currentScheduleResult.isSuccess, currentScheduleResult.data, dispatch]);

  const [detailMode, setDetailMode] = useState(true);
  const currentSchedule = useSelector(currentScheduleSelector);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const onClose = useCallback(() => {
    if (close) {
      close();
    }

    setTimeout(() => {
      dispatch(setCurrentSchedule(null));
      dispatch(setScheduleID(-1));
      dispatch(setScheduleModalStatus(false));
      setIsLoaded(false);
      setDetailMode(true);
    }, 200);
  }, [dispatch, close]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      center
      showCloseIcon={false}
      classNames={{
        modal: 'modal-lg-size-draggable',
      }}
    >
      <div onClick={onClose} className="absolute inset-0" />
      <Draggable
        positionOffset={{ x: '-50%', y: '0%' }}
        nodeRef={modalRef}
        handle={'.dragbar'}
        cancel={`.cancel,.react-responsive-modal-overlay`}
      >
        <div
          ref={modalRef}
          onBlur={(_) => {
            if (isLoaded && !modalRef.current?.contains(_.relatedTarget)) {
              onClose();
            }
          }}
          className="pt-36px bg-backgroundSecondary rounded-8px relative shadow-menu flex flex-col cursor-auto"
          tabIndex={-1}
        >
          <div
            className="absolute top-0 left-0 right-0 h-36px w-full rounded-t-6px bg-separator dragbar cursor-move"
            onClick={() => {
              setIsLoaded(true);
            }}
          />
          <div className="py-8px px-36px draggable-modal-custom overflow-y-auto">
            {scheduleID && scheduleID > 0 && detailMode ? (
              <ScheduleDetail
                onOffDetail={() => {
                  setDetailMode(false);
                }}
                className="cancel"
              />
            ) : (
              <ScheduleAdd
                close={() => {
                  if (currentSchedule) setDetailMode(true);
                  onClose();
                  setDetailMode(true);
                  dispatch(setCurrentSchedule(null));
                  dispatch(setScheduleID(-1));
                  dispatch(setScheduleModalStatus(false));
                }}
                className="cancel"
              />
            )}
          </div>
        </div>
      </Draggable>
    </Modal>
  );
};

export default ModalSchedule;
