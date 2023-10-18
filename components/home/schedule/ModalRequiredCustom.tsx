import { useEffect, useRef, useState } from 'react';
import Modal from 'react-responsive-modal';
import Select from 'react-select';

import DownTriangleIcon from '@svg/triangle-small.svg';
import ModalDefaultProps from '@model/modal';
import defaultSelectStyles from '@util/selectConfig';
import { REQUIRED_TIME_CUSTOM_OPTIONS } from '@util/selectOptions';
import { getHourMinFormat } from '@util/calendar';

interface ModalCustomProps extends ModalDefaultProps {
  title?: string;
  addNewValue: (newValue: any) => void;
}

const ModalRequiredCustom = ({
  isOpen,
  close,
  addNewValue,
  title,
}: ModalCustomProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = useState(true);
  const [timeType, setTimeType] = useState(0);

  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);

  return (
    <Modal
      open={isOpen}
      onClose={close}
      center
      showCloseIcon={false}
      classNames={{
        modal: 'modal-md-size',
      }}
    >
      <div className="p-36px">
        <div className="big-title-light text-fontPrimary">
          {title ? title : '所要時間'}
        </div>
        <div className="mt-24px flex items-center">
          <input
            ref={inputRef}
            type="text"
            onChange={(e) => {
              if (inputRef.current) {
                const newValue = e.target.value.replace(/\D/g, '');
                inputRef.current.value = newValue;
                if (parseInt(newValue) > 0 && parseInt(newValue) < 1000) {
                  setDisabled(false);
                } else {
                  setDisabled(true);
                }
              } else {
                setDisabled(true);
              }
            }}
            className="flex-1 mr-8px px-12px py-8px rounded-md border-1/2 border-separator focus:outline-none"
          />
          <Select
            instanceId="required-time-custom-select"
            styles={{
              ...defaultSelectStyles,
              control: (provided) => ({
                ...provided,
                paddingLeft: '16px',
                width: '140px',
                height: '42px',
                border: '0.5px solid #eaeaea',
                boxShadow: 'none',
                backgroundColor: '#fff',
              }),
              menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
            }}
            menuPortalTarget={(() => {
              if (windowRef.current) {
                return windowRef.current.document.body;
              }
              return undefined;
            })()}
            options={REQUIRED_TIME_CUSTOM_OPTIONS}
            value={REQUIRED_TIME_CUSTOM_OPTIONS[timeType]}
            isSearchable={false}
            onChange={(newValue: any) => {
              setTimeType(parseInt(newValue.value));
            }}
            components={{
              DropdownIndicator: ({ innerProps, isDisabled }) => {
                return !isDisabled ? (
                  <DownTriangleIcon
                    {...innerProps}
                    width={20}
                    height={20}
                    className="ml-4px caption2 text-fontSecondary"
                  />
                ) : null;
              },
              IndicatorSeparator: () => null,
            }}
          />
        </div>
        <div className="mt-24px flex items-center justify-end">
          <div
            className="p-12px body1 text-fontSecondary cursor-pointer"
            onClick={close}
          >
            キャンセル
          </div>
          <button
            className="ml-12px py-12px px-24px rounded-8px bg-primary body1 text-backgroundSecondary disabled:opacity-60"
            disabled={disabled}
            onClick={() => {
              if (inputRef.current) {
                const totalMins =
                  parseInt(inputRef.current.value) * (timeType == 0 ? 1 : 60);

                addNewValue({
                  label: getHourMinFormat(totalMins),
                  value: totalMins.toString(),
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

export default ModalRequiredCustom;
