import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-responsive-modal';

import { countLimitADaySelector } from '@store/selectors/calendar';
import CountLimitRow from './CountLimitRow';
import {
  setSchedulesCountLimit,
  setTasksCountLimit,
} from '@store/modules/calendar';

interface CustomModalProps {
  isOpen: boolean;
  close: () => void;
  container?: HTMLDivElement;
}

const ModalDisplaySetting = (props: CustomModalProps) => {
  const countLimit = useSelector(countLimitADaySelector);
  const dispatch = useDispatch();

  return (
    <>
      <Modal
        open={props.isOpen}
        onClose={props.close}
        showCloseIcon={false}
        container={props.container}
        classNames={{
          root: 'modal-calendar-setting-root',
          modal: 'modal-calendar-setting',
          overlay: 'modal-calendar-setting-overlay',
        }}
      >
        <div className="p-12px">
          <CountLimitRow
            desc="スケジュール表示数"
            count={countLimit?.schedule ?? 0}
            setCount={(newValue: number) => {
              dispatch(setSchedulesCountLimit(newValue));
            }}
          />
          <CountLimitRow
            desc="タスク表示数"
            count={countLimit?.task ?? 0}
            setCount={(newValue: number) => {
              dispatch(setTasksCountLimit(newValue));
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default ModalDisplaySetting;
