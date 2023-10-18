import { useEffect, useRef, useState } from 'react';
import Modal from 'react-responsive-modal';
import Select from 'react-select';

import { ModalBulkTasksProps } from '@model/modal';
import defaultSelectStyles from '@util/selectConfig';
import DownTriangleIcon from '@svg/triangle-small.svg';
import { IMPORTANCE_OPTIONS, REQUIRED_TIME_OPTIONS } from '@util/selectOptions';
import { useBulkTasksUpdate } from '@service/taskMutation';

const ModalRequiredTime = ({
  selectedList,
  isOpen,
  close,
}: ModalBulkTasksProps) => {
  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);
  const [value, setValue] = useState(30);
  const mutation = useBulkTasksUpdate(() => {
    close();
  });

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        close();
      }}
      showCloseIcon={false}
      center
      classNames={{
        modal: 'modal-md-size',
      }}
    >
      <div className="p-36px w-full h-full">
        <div className="big-title text-fontPrimary">所要時間</div>
        <div className="mt-36px">
          <Select
            options={REQUIRED_TIME_OPTIONS}
            value={
              IMPORTANCE_OPTIONS.filter(
                (item) => parseInt(item.value) == value,
              )[0] ?? undefined
            }
            placeholder={'所要時間'}
            styles={{
              ...defaultSelectStyles,
              menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
            }}
            isSearchable={false}
            onChange={(newValue: any) => {
              setValue(parseInt(newValue.value));
            }}
            menuPortalTarget={(() => {
              if (windowRef.current) {
                return windowRef.current.document.body;
              }
              return undefined;
            })()}
            components={{
              NoOptionsMessage: () => (
                <div className="px-24px py-12px">オプションはありません</div>
              ),
              DropdownIndicator: ({ innerProps, isDisabled }) =>
                !isDisabled ? (
                  <DownTriangleIcon
                    {...innerProps}
                    width={20}
                    height={20}
                    className="absolute mr-16px top-12px right-0 text-fontSecondary"
                  />
                ) : null,
              IndicatorSeparator: () => null,
            }}
          />
        </div>
        <div className="mt-36px flex flex-row justify-end items-center">
          <span
            onClick={close}
            className="button text-fontSecondary cursor-pointer"
          >
            キャンセル
          </span>
          <button
            className="ml-24px px-24px h-44px rounded-8px bg-primary button text-backgroundSecondary"
            onClick={() => {
              if (mutation.isLoading) {
              } else {
                mutation.mutate({
                  task_ids: selectedList,
                  required_time: value,
                });
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

export default ModalRequiredTime;
