import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-responsive-modal';

import DateInput from './DateInput';
import TimeSelect from './TimeInput';
import { WEEKDAYS_JP } from '@util/constants';
import { userInfoSelector } from '@store/selectors/user';
import ModalDefaultProps from '@model/modal';

interface ModalReminderProps extends ModalDefaultProps {
  addNewValue: (newValue: any) => void;
  endDatetime?: Date;
}

const ModalReminderCustom = ({
  isOpen,
  close,
  addNewValue,
  endDatetime,
}: ModalReminderProps) => {
  const { user } = useSelector(userInfoSelector);
  const timeMode24: boolean = useMemo(() => {
    if (user?.time_display) {
      return user?.time_display == 2;
    } else {
      return false;
    }
  }, [user]);

  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('12:00');

  return (
    <Modal
      open={isOpen}
      onClose={close}
      center
      showCloseIcon={false}
      classNames={{
        modal: 'modal-md-size-with-calendar',
      }}
    >
      <div className="p-36px">
        <div className="big-title-light text-fontPrimary">
          リマインダーカスタム
        </div>
        <DateInput
          className="mt-36px"
          date={currentDate}
          changeDate={(newDate: Date) => {
            if (!newDate) {
              setCurrentDate(newDate);
            } else if (
              !endDatetime ||
              newDate.getTime() < endDatetime?.getTime()
            ) {
              setCurrentDate(newDate);
            }
          }}
        />
        <TimeSelect
          className="mt-24px"
          value={currentTime}
          isDisabled={currentDate == null}
          change={(newTime: string) => {
            if (currentDate) {
              const [hour, min] = newTime.split(':');
              const newReminderDate = new Date(currentDate);
              newReminderDate.setHours(parseInt(hour), parseInt(min), 0, 0);

              if (
                endDatetime &&
                newReminderDate.getTime() < endDatetime.getTime()
              )
                setCurrentTime(newTime);
            }
          }}
        />
        <div className="mt-36px flex items-center justify-end">
          <div
            className="p-12px body1 text-fontSecondary cursor-pointer"
            onClick={close}
          >
            キャンセル
          </div>
          <button
            className="ml-12px py-12px px-24px rounded-8px bg-primary body1 text-backgroundSecondary disabled:bg-primaryDisabled"
            disabled={currentDate == null}
            onClick={() => {
              if (currentDate) {
                const year = currentDate.getFullYear().toString();
                const month = (currentDate.getMonth() + 1).toString();
                const day = currentDate.getDate().toString();
                const date =
                  month +
                  '月' +
                  day +
                  '日(' +
                  WEEKDAYS_JP[currentDate.getDay()] +
                  ')';
                const [h, m] = currentTime.split(':');
                const time = timeMode24
                  ? `${h}:${m}`
                  : `${
                      parseInt(h) > 12 ? parseInt(h) - 12 : parseInt(h)
                    }:${m} ${parseInt(h) > 11 ? 'pm' : 'am'}`;

                addNewValue({
                  label: date + ',' + time,
                  value: `${year}-${month}-${day} ${h}:${m}:00`,
                  type: 'custom',
                });
                close();
              }
            }}
          >
            完了
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalReminderCustom;
