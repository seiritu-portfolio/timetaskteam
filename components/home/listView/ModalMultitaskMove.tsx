import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-responsive-modal';
import Select from 'react-select';

import { ModalBulkTasksProps } from '@model/modal';
import { taskListsSelector } from '@store/selectors/list';
import { taskInboxIDSelector } from '@store/selectors/user';
import defaultSelectStyles from '@util/selectConfig';
import DownTriangleIcon from '@svg/triangle-small.svg';
import { useBulkTasksUpdate } from '@service/taskMutation';

const ModalMultitaskMove = ({
  selectedList,
  isOpen,
  close,
}: ModalBulkTasksProps) => {
  const tasksList = useSelector(taskListsSelector);
  const taskInboxID = useSelector(taskInboxIDSelector);
  const allLists = useMemo(() => {
    if (tasksList.length === 0) {
      return [];
    }
    const listCollection = tasksList.reduce(
      (
        ctx: {
          [id: string]: any;
        },
        el: any,
      ) => {
        if (el.id === taskInboxID) {
          ctx.inbox.push(el);
        } else {
          ctx.general.push(el);
        }
        return ctx;
      },
      {
        inbox: [],
        general: [],
      },
    );
    let resultArray: any[] = [];
    if (listCollection.inbox.length > 0) {
      resultArray.push({
        label: 'インボックス',
        value: taskInboxID.toString(),
      });
    }
    const generals: any[] = [];
    if (listCollection.general.length > 0) {
      listCollection.general.map((_: any) => {
        generals.push({
          label: _.name,
          value: _.id.toString(),
        });
      });
    }
    resultArray = [...resultArray, ...generals];
    return resultArray;
  }, [tasksList, taskInboxID]);

  const [listId, setListId] = useState<number>(taskInboxID);
  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);
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
        <div className="big-title text-fontPrimary">タスクリストの移動</div>
        <div className="mt-36px">
          <Select
            options={allLists}
            value={(() => {
              const filtered = allLists.filter(
                (_) => parseInt(_.value) == listId,
              );

              return filtered.length === 0 ? undefined : filtered[0];
            })()}
            // value={[inboxList, ...generalLists][listId]}
            styles={{
              ...defaultSelectStyles,
              menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
            }}
            isSearchable={false}
            placeholder={
              <span className="text-fontSecondary">タスクリスト</span>
            }
            onChange={(newValue: any) => {
              setListId(parseInt(newValue.value));
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
                  list_id: listId,
                  task_ids: selectedList,
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

export default ModalMultitaskMove;
