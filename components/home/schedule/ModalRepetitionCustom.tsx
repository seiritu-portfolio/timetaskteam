import { useState } from 'react';
import Modal from 'react-responsive-modal';
import { Calendar } from 'react-date-range';
// @ts-ignore
import * as rdrLocales from 'react-date-range/dist/locale';
import ResetIcon from '@svg/multiply-circle-fill-small.svg';

import ModalDefaultProps from '@model/modal';
import {
  RepetitionPeriodTimesSelect,
  RepetitionPeriodTypeSelect,
  WeekdayMultiSelect,
} from '../Selects';
import { WEEKDAYS_EN, WEEKDAYS_JP } from '@util/constants';

interface ModalRepetitionCustomProps extends ModalDefaultProps {
  addNewValue: (newValue: any) => void;
}

const ModalRepetitionCustom = ({
  isOpen,
  close,
  addNewValue,
}: ModalRepetitionCustomProps) => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [reset, setReset] = useState(false);

  const [interval, setInterval] = useState(1);
  const [freq, setFreq] = useState('WEEKLY');
  const [byday, setByday] = useState<number[]>([]);
  const [until, setUntil] = useState<Date | null>(null);

  return (
    <>
      <Modal
        open={isOpen}
        onClose={close}
        center
        showCloseIcon={false}
        classNames={{
          modal: 'modal-md-size-with-calendar',
          //   modal: 'modal-md-size',
        }}
      >
        <div className="p-36px">
          <div className="big-title-light text-fontPrimary">
            繰り返しカスタム
          </div>
          <div className="mt-36px flex">
            <div className="flex-none">
              <RepetitionPeriodTimesSelect
                value={interval}
                setValue={setInterval}
              />
            </div>
            <div className="ml-2px flex-1">
              <RepetitionPeriodTypeSelect value={freq} setValue={setFreq} />
            </div>
          </div>
          <div className="mt-24px">
            <WeekdayMultiSelect values={byday} setValues={setByday} />
          </div>
          <div
            className="relative mt-24px px-16px py-12px rounded-8px bg-backgroundPrimary flex-row--between cursor-pointer focus:bg-overlayWeb2"
            onClick={() => {
              setOpenCalendar((old) => !old);
            }}
            tabIndex={3}
          >
            <span
              className={`${until ? 'text-fontPrimary' : 'text-fontSecondary'}`}
            >
              {until
                ? `${until.getFullYear()}年${
                    until.getMonth() + 1
                  }月${until.getDate()}日`
                : '終了日'}
            </span>
            {reset && (
              <ResetIcon
                width={20}
                height={20}
                onClick={(e: any) => {
                  e.stopPropagation();
                  setUntil(null);
                }}
                className="text-fontSecondary"
              />
            )}
            {openCalendar && (
              <>
                <div className="absolute mt-6 inset-0 z-9999">
                  <Calendar
                    locale={rdrLocales.ja}
                    onChange={(e) => {
                      setUntil(e);
                      setReset(true);
                    }}
                  />
                </div>
              </>
            )}
          </div>
          <div className="mt-36px flex items-center justify-end">
            <div
              className="p-12px body1 text-fontSecondary cursor-pointer"
              onClick={close}
            >
              キャンセル
            </div>
            <button
              className="ml-12px py-12px px-24px rounded-8px bg-primary body1 text-backgroundSecondary disabled:opacity-40"
              disabled={until == null}
              onClick={() => {
                const newRRULE = [];
                const untilMonth = until ? until.getMonth() + 1 : 0;
                const untilDay = until ? until.getDate() : 0;
                // const untilMonth = until ? (until.getMonth() + 1)   until?.getMonth() ?? 0 + 1;
                newRRULE.push(`FREQ=${freq}`);
                newRRULE.push(
                  `UNTIL=${until?.getFullYear()}${
                    untilMonth > 9 ? untilMonth : `0${untilMonth}`
                  }${untilDay > 9 ? untilDay : `0${untilDay}`}`,
                );
                newRRULE.push(`INTERVAL=${interval}`);
                if (byday.length > 0) {
                  const weekdaysEn = byday.map((_) => WEEKDAYS_EN[_]);
                  newRRULE.push(`BYDAY=${weekdaysEn.join(',')}`);
                }
                let label = `毎${interval === 1 ? '' : interval}${
                  freq === 'DAILY'
                    ? '日'
                    : freq === 'WEEKLY'
                    ? '週'
                    : freq === 'MONTHLY'
                    ? 'ヶ月'
                    : '年'
                }${
                  byday.length > 0
                    ? byday.map((_) => WEEKDAYS_JP[_]).join('と')
                    : ''
                },${untilMonth}月${until?.getDate()}日まで`;

                addNewValue({
                  label,
                  value: newRRULE.join(';'),
                });
                close();
              }}
            >
              完了
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalRepetitionCustom;
