import { useMemo } from 'react';
import Select, { components } from 'react-select';
// * components
import { LIST_MENULIST, LIST_SELECTITEM } from '@util/selectComponents';
// * assets
import DownTriangleIcon from '@svg/triangle-small.svg';
// * constants
import { listSelectStyles } from '@util/selectConfig';
import { ListType } from '@model/state';

const ListSelect = ({
  value,
  onChange,
  options,
  inboxId,
}: {
  value?: number;
  onChange: (newValue: number) => void;
  options: ListType[];
  inboxId?: number;
}) => {
  const sortedLists = useMemo(() => {
    if (options.length === 0) {
      return [];
    }
    const listCollection = options.reduce(
      (
        ctx: {
          [id: string]: any;
        },
        el: any,
      ) => {
        if (el.id === inboxId) {
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
        value: (inboxId ?? 0).toString(),
        icon: -1,
        isPublic: listCollection.inbox[0].status === 1,
      });
    }
    const generals: any[] = [];
    if (listCollection.general.length > 0) {
      listCollection.general.map((_: any) => {
        generals.push({
          label: _.name,
          value: _.id.toString(),
          icon: _.icon,
          isPublic: _.status === 1,
        });
      });
    }
    resultArray = [...resultArray, ...generals];
    return resultArray;
  }, [options, inboxId]);

  return (
    <Select
      instanceId="note-list-select"
      styles={listSelectStyles}
      options={sortedLists}
      value={
        sortedLists.filter(
          (item: any) => parseInt(item?.value ?? '-1') === value,
        )[0]
      }
      isSearchable={false}
      onChange={(newValue: any) => {
        onChange(parseInt(newValue.value));
      }}
      placeholder={
        <span className="px-24px body1 text-fontSecondary">
          リストを選択...
        </span>
      }
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
        Option: (props) => {
          return !props.isDisabled ? (
            <LIST_SELECTITEM
              label={props.data.label}
              // @ts-ignore
              iconID={props.data.icon}
              // @ts-ignore
              isPublic={props.data.isPublic}
              additionalClass=" hover:bg-primarySelected hover:text-primary cursor-pointer"
              {...props.innerProps}
            />
          ) : null;
        },
        SingleValue: (props) => {
          return (
            <components.SingleValue {...props}>
              <LIST_SELECTITEM
                label={props.selectProps.getOptionLabel(props.data)}
                // @ts-ignore
                iconID={props.selectProps.value.icon}
                // @ts-ignore
                isPublic={props.selectProps.value.isPublic}
              />
            </components.SingleValue>
          );
        },
        MenuList: (props) => {
          return <LIST_MENULIST {...props} type={3} />;
        },
      }}
    />
  );
};

export default ListSelect;
