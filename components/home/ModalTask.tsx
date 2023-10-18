import React, { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-responsive-modal';
import Draggable from 'react-draggable';
// * hooks
import { setCurrentTask, setTaskID } from '@store/modules/tasks';
import { currentTaskIDSelector } from '@store/selectors/tasks';
// * components
import TaskDetail from './tasks/TaskDetail';
// * assets
import ModalDefaultProps from '@model/modal';

const ModalTask = ({ isOpen, close }: ModalDefaultProps) => {
  const currentTaskID = useSelector(currentTaskIDSelector);
  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const onClose = useCallback(() => {
    close();
    dispatch(setCurrentTask(null));
    dispatch(setTaskID(-1));
    setIsLoaded(false);
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
      focusTrapped={true}
    >
      <div onClick={onClose} className="absolute inset-0" />
      <Draggable
        positionOffset={{ x: '-50%', y: '0%' }}
        nodeRef={modalRef}
        handle={'.dragbar'}
        cancel={`.cancel, .react-responsive-modal-overlay`}
      >
        <div
          ref={modalRef}
          onBlur={(_) => {
            if (isLoaded && !modalRef.current?.contains(_.relatedTarget)) {
              onClose();
            }
          }}
          className="pt-36px bg-backgroundSecondary rounded-8px shadow-menu overflow-visible cursor-auto"
          tabIndex={-1}
        >
          <div
            className="absolute top-0 left-0 right-0 h-36px w-full rounded-t-6px bg-separator dragbar cursor-move"
            onClick={() => {
              setIsLoaded(true);
            }}
          />
          <div className="px-12px draggable-modal-custom overflow-y-auto">
            <TaskDetail
              id={currentTaskID}
              close={close}
              isModal={true}
              className="cancel"
            />
          </div>
        </div>
      </Draggable>
    </Modal>
  );
};

export default ModalTask;
