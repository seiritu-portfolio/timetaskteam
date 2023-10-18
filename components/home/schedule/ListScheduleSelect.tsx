import { useMemo, useState } from 'react';
import Select, { components } from 'react-select';
import { useSelector } from 'react-redux';

import { scheduleListsSelector } from '@store/selectors/list';
import { listSelectStyles } from '@util/selectConfig';
import { LIST_MENULIST, LIST_SCHEDULE_ITEM } from '@util/selectComponents';
import { scheduleInboxIDSelector } from '@store/selectors/user';
import DownTriangleIcon from '@svg/triangle-small.svg';

const ListScheduleSelect = ({
  listID,
  select,
}: {
  listID?: number;
  select?: (id: number, color: number) => void;
}) => {
  const scheduleLists = useSelector(scheduleListsSelector);
  const scheduleInboxID = useSelector(scheduleInboxIDSelector);

  const sortedList: any[] = useMemo(() => {
    if (scheduleLists.length === 0) {
      return [];
    }
    const listCollection = scheduleLists.reduce(
      (
        ctx: {
          [id: string]: any;
        },
        el: any,
      ) => {
        if (el.id === scheduleInboxID) {
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
    const listInbox =
      listCollection.inbox.length > 0
        ? {
            label: 'インボックス',
            value: scheduleInboxID.toString(),
            color: listCollection.inbox[0].color,
            isPublic: listCollection.inbox[0].status === 1,
          }
        : undefined;
    // ! :)
    // setValue(listInbox);
    let resultArray: any[] = [];
    if (listInbox) {
      resultArray.push(listInbox);
    }
    if (listCollection.general.length > 0) {
      listCollection.general.map((_: any) => {
        resultArray.push({
          label: _.name,
          value: _.id.toString(),
          color: _.color,
          isPublic: _.status === 1,
        });
      });
    }
    return resultArray;
  }, [scheduleLists, scheduleInboxID]);

  return (
    <Select
      instanceId="list-schedule-select"
      styles={listSelectStyles}
      options={sortedList}
      value={(() => {
        const filtered = sortedList.filter((list) => list.value == listID);
        return filtered.length > 0 ? filtered[0] : undefined;
      })()}
      isSearchable={false}
      isMulti={false}
      onChange={(e) => {
        if (e?.value && select) {
          select(parseInt(e.value == '' ? '0' : e.value), e.color);
        }
      }}
      components={{
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
        NoOptionsMessage: () => (
          <div className="px-24px py-12px">オプションはありません</div>
        ),
        Placeholder: (props) => {
          return (
            <components.Placeholder {...props}>
              <div className="ml-16px body1 text-fontSecondary">
                リストを選択...
              </div>
            </components.Placeholder>
          );
        },
        Option: (props) => {
          return !props.isDisabled ? (
            <LIST_SCHEDULE_ITEM
              label={props.data.label}
              // @ts-ignore
              color={props.data.color}
              // @ts-ignore
              isPublic={props.data.isPublic}
              additionalClass="hover:bg-primarySelected hover:text-primary cursor-pointer"
              {...props.innerProps}
            />
          ) : null;
        },
        SingleValue: (props) => {
          return (
            <components.SingleValue {...props}>
              <LIST_SCHEDULE_ITEM
                // {...props}
                label={props.selectProps.getOptionLabel(props.data)}
                // @ts-ignore
                color={props.selectProps.value.color}
                // @ts-ignore
                isPublic={props.selectProps.value.isPublic}
              />
            </components.SingleValue>
          );
        },
        MenuList: (props) => {
          return <LIST_MENULIST {...props} type={2} />;
        },
      }}
    />
  );
};

export default ListScheduleSelect;
