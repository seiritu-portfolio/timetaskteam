import { useEffect, useRef } from 'react';
import Select, { components } from 'react-select';

import DownTriangleIcon from '@svg/triangle-small.svg';
import PrivateIcon from '@svg/lock-shield.svg';
import defaultSelectStyles from '@util/selectConfig';
import { COLOR_VALUES } from '@util/constants';

const CalendarScheduleSelect = ({
  calendar,
  scheduleOptions,
  scheduleID,
  onSelect,
  isOptionDisabled,
}: {
  calendar: { id: string; summary: string };
  scheduleOptions: any[];
  scheduleID: number;
  onSelect: (newValue: number) => void;
  isOptionDisabled: (option: any) => boolean;
}) => {
  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);

  const options = [
    ...scheduleOptions,
    {
      label: 'エクスポートしない',
      value: -1,
      color: undefined,
      private: false,
    },
  ];

  return (
    <>
      <div className="mt-24px title-en text-fontPrimary">
        {calendar.summary}
      </div>
      <div className="mt-12px w-full">
        <Select
          styles={{
            ...defaultSelectStyles,
            menuList: (provided) => ({
              ...provided,
              maxHeight: '200px',
              overflow: 'auto',
            }),
            menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
          }}
          options={options}
          isSearchable={false}
          placeholder={
            <span className="body1 text-fontSecondary">インポートしない</span>
          }
          menuPortalTarget={(() => {
            if (windowRef.current) {
              return windowRef.current.document.body;
            }
            return undefined;
          })()}
          value={(() => {
            const filtered = options.filter(
              (option) => option.value == scheduleID,
            );
            return filtered.length > 0 ? filtered[0] : undefined;
          })()}
          isOptionDisabled={isOptionDisabled}
          onChange={(newValue: any) => {
            onSelect(newValue.value);
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
            Option: (props) => {
              return !props.isDisabled ? (
                <div
                  className={`h-44px px-12px py-12px rounded-8px body1 ${
                    !props.isFocused
                      ? 'text-fontPrimary'
                      : 'text-primary bg-primaryHovered'
                  } flex-row--between`}
                  {...props.innerProps}
                >
                  <div className="flex items-center">
                    {
                      // @ts-ignore
                      props.data.color != undefined && (
                        <div className="mr-16px h-20px w-20px flex-xy-center">
                          <div
                            className={`h-14px w-14px rounded-full bg-${
                              // @ts-ignore
                              COLOR_VALUES[props.data.color].label
                            }`}
                          />
                        </div>
                      )
                    }
                    <span>{props.data.label}</span>
                  </div>
                  {
                    // @ts-ignore
                    props.data.private && <PrivateIcon width={20} height={20} />
                  }
                </div>
              ) : null;
            },
            SingleValue: (props) => {
              return (
                <components.SingleValue {...props}>
                  <div
                    className={`h-44px py-12px rounded-8px body1 text-fontPrimary flex-row--between`}
                    {...props.innerProps}
                  >
                    <div className="flex items-center">
                      {
                        // @ts-ignore
                        props.data.color != undefined && (
                          <div className="mr-16px h-20px w-20px flex-xy-center">
                            <div
                              className={`h-14px w-14px rounded-full bg-${
                                // @ts-ignore
                                COLOR_VALUES[props.data.color].label
                              }`}
                            />
                          </div>
                        )
                      }
                      <span>
                        {props.selectProps.getOptionLabel(props.data)}
                      </span>
                    </div>
                    {
                      // @ts-ignore
                      props.data.private && (
                        <PrivateIcon width={20} height={20} />
                      )
                    }
                  </div>
                </components.SingleValue>
              );
            },
            MenuList: (props: any) => (
              <div className="px-12px">{props.children}</div>
            ),
          }}
        />
      </div>
    </>
  );
};

export default CalendarScheduleSelect;
