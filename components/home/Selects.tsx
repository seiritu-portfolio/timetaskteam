import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Select, { components } from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import dayjs, { Dayjs } from 'dayjs';
import DatePicker, { registerLocale } from 'react-datepicker';
import ja from 'date-fns/locale/ja';
registerLocale('ja', ja);
// * hooks
import {
  groupsSelector,
  guestsSelector,
  membersSelector,
} from '@store/selectors/collabos';
import { setGroupUserSelectModal } from '@store/modules/home';
// * components
import ModalReminderCustom from './schedule/ModalReminderCustom';
import ModalRepetitionCustom from './schedule/ModalRepetitionCustom';
import GroupUsersIconList from '@component/settings/userList/parts/GroupUsersIconList';
import ModalRequiredCustom from './schedule/ModalRequiredCustom';
// * utils
import { getHourMinFormat } from '@util/calendar';
// * assets
import AllUsersIcon from '@svg/person-2.svg';
import DownTriangleIcon from '@svg/triangle-small.svg';
import UncheckedIcon from '@svg/square.svg';
import CheckmarkIcon from '@svg/checkmark-square.svg';
import CheckmarkFillIcon from '@svg/checkmark-square-fill.svg';
import MinusIcon from '@svg/minus.svg';
import DefaultAvatarIcon from '@image/default_avatar.png';
// * constants
import defaultSelectStyles, { groupsSelectStyle } from '@util/selectConfig';
import {
  COUNT_LIMIT_OPTIONS,
  GROUP_DEFAULT_OPTIONS,
  HOURS_A_DAY_LIST,
  IMPORTANCE_OPTIONS,
  REMINDER_OPTIONS,
  REPETITION_OPTIONS,
  REPETITION_PERIOD_TIMES_LIST,
  REPETITION_PERIOD_TYPES_OPTIONS,
  REQUIRED_TIME_OPTIONS,
  TASK_EXECUTION_STATUS_OPTIONS,
  VIEWMODE_OPTIONS,
  WEEKDAY_OPTIONS,
} from '@util/selectOptions';
import {
  COLOR_VALUES,
  TASK_STATUS_A_DAY,
  WEEKDAYS_EN,
  WEEKDAYS_JP,
} from '@util/constants';
import { COLOR_MENULIST, GROUP_MENULIST } from '@util/selectComponents';
import { DEFAULT_AVATAR_URL } from '@util/urls';

import 'react-datepicker/dist/react-datepicker.css';

const ImportanceSelect = ({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (newValue: number) => void;
  className: string;
}) => {
  /**
   * * instanceId might need to be different for creating & editing cases
   */

  return (
    <div className={`${className}`}>
      <Select
        instanceId="importance-select"
        styles={{
          ...defaultSelectStyles,
          control: (provided) => ({
            ...provided,
            paddingLeft: '16px',
            paddingRight: '16px',
            height: '44px',
            border: 'none',
            boxShadow: 'none',
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '0px',
            backgroundColor: '#f9f9f9',
          }),
        }}
        options={IMPORTANCE_OPTIONS}
        value={IMPORTANCE_OPTIONS[value - 1]}
        isSearchable={false}
        onChange={(newValue: any) => {
          onChange(parseInt(newValue.value));
        }}
        components={{
          DropdownIndicator: () => (
            <span className="caption2-light text-fontSecondary">重要度</span>
          ),
          IndicatorSeparator: () => null,
        }}
      />
    </div>
  );
};

const RequiredTimeSelect = ({
  className,
  value,
  onChange,
  label,
}: {
  className: string;
  value: number;
  onChange: (newValue: number) => void;
  label?: string;
}) => {
  const [isCustomModal, setIsCustomModal] = useState(false);
  const [options, setOptions] = useState(REQUIRED_TIME_OPTIONS);
  const [open, setOpen] = useState(false);

  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);

  useEffect(() => {
    const valueIncluded = REQUIRED_TIME_OPTIONS.filter(
      (item) => parseInt(item.value) == value,
    );
    if (valueIncluded.length > 0) {
      onChange(parseInt(valueIncluded[0].value));
    } else {
      setOptions([
        ...REQUIRED_TIME_OPTIONS,
        {
          label: getHourMinFormat(value),
          value: value?.toString() ?? '',
        },
      ]);
    }
  }, [value, onChange]);

  return (
    <div className={`${className}`}>
      <Select
        instanceId="required-time-select-2"
        isMulti={false}
        menuIsOpen={open}
        onMenuOpen={() => setOpen(true)}
        onMenuClose={() => setOpen(false)}
        styles={{
          ...defaultSelectStyles,
          control: (provided) => ({
            ...provided,
            paddingLeft: '16px',
            paddingRight: '16px',
            height: '44px',
            border: 'none',
            boxShadow: 'none',
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '0px',
            backgroundColor: '#f9f9f9',
          }),
          menu: (provided) => ({
            ...provided,
            height: '200px',
            overflow: 'auto',
          }),
          menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
        }}
        options={options}
        menuPortalTarget={(() => {
          if (windowRef.current) {
            return windowRef.current.document.body;
          }
          return undefined;
        })()}
        value={options.filter((item) => parseInt(item.value) === value)[0]}
        isSearchable={false}
        onChange={(newValue: any) => {
          onChange(parseInt(newValue.value));
        }}
        components={{
          DropdownIndicator: ({ innerProps, isDisabled }) => {
            return !isDisabled ? (
              <div className="absolute mr-16px top-12px right-0 flex items-center">
                <span className="caption2-light text-fontSecondary">
                  {label ? label : '所要時間'}
                </span>
                <DownTriangleIcon
                  {...innerProps}
                  width={20}
                  height={20}
                  className="ml-4px caption2 text-fontSecondary"
                />
              </div>
            ) : null;
          },
          IndicatorSeparator: () => null,
          Option: (props) => {
            return !props.isDisabled ? (
              <div
                {...props.innerProps}
                className="px-16px py-12px rounded-6px text-fontPrimary body1 hover:bg-primaryHovered hover:text-primary cursor-pointer "
              >
                {props.data.label}
              </div>
            ) : null;
          },
          MenuList: (props: any) => (
            <div className="p-12px">
              {props.children}
              <div
                onClick={() => {
                  setIsCustomModal(true);
                  setOpen(false);
                }}
                className="p-12px body1 text-fontSecondary hover:text-primary cursor-pointer"
              >
                カスタム
              </div>
            </div>
          ),
        }}
      />
      <ModalRequiredCustom
        isOpen={isCustomModal}
        close={() => {
          setIsCustomModal(false);
        }}
        addNewValue={(newValue: any) => {
          // check if the new value exists
          const currentOptionValues = options.map((_) => _.value);
          if (!currentOptionValues.includes(newValue.value)) {
            setOptions([newValue, ...options]);
          } else {
            onChange(parseInt(newValue.value));
          }
        }}
        title={label ? label : '所要時間'}
      />
    </div>
  );
};

const ReminderSelect = ({
  value,
  setValue,
  endDatetime,
}: {
  value: any;
  setValue: (newValue: any) => void;
  endDatetime?: Date;
}) => {
  const [isCustomModal, setIsCustomModal] = useState(false);
  const [options, setOptions] = useState(REMINDER_OPTIONS);
  // const [value, setValue] = useState(REMINDER_OPTIONS[0]);
  const [open, setOpen] = useState(false);
  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);

  useEffect(() => {
    if (options.length === 0 || !value) {
    } else {
      const valueIncluded = options.filter(
        (item) => item.value === value.value,
      );
      if (valueIncluded.length > 0) {
        setValue(valueIncluded[0]);
      } else {
        setOptions([...options, value]);
      }
    }
  }, [options, value, setValue]);

  return (
    <>
      <Select
        instanceId="reminder-select"
        isMulti={false}
        menuIsOpen={open}
        onMenuOpen={() => setOpen(true)}
        onMenuClose={() => setOpen(false)}
        styles={{
          ...defaultSelectStyles,
          control: (provided) => ({
            ...provided,
            paddingLeft: '16px',
            paddingRight: '16px',
            height: '44px',
            border: 'none',
            boxShadow: 'none',
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '0px',
            backgroundColor: '#f9f9f9',
          }),
          menu: (provided) => ({
            ...provided,
            height: '200px',
            overflow: 'auto',
          }),
          menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
        }}
        options={options}
        value={value}
        onChange={(newValue) => {
          if (newValue) {
            setValue(newValue);
          }
        }}
        menuPortalTarget={(() => {
          if (windowRef.current) {
            return windowRef.current.document.body;
          }
          return undefined;
        })()}
        isSearchable={false}
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
          Option: (props) => {
            return !props.isDisabled ? (
              <div
                {...props.innerProps}
                className="px-16px py-12px rounded-6px text-fontPrimary body1 hover:bg-primaryHovered hover:text-primary cursor-pointer"
              >
                {props.data.label}
              </div>
            ) : null;
          },
          MenuList: (props: any) => (
            <div className="">
              {props.children}
              <div
                className="p-12px body1 text-fontSecondary cursor-pointer"
                onClick={() => {
                  setIsCustomModal(true);
                  setOpen(false);
                }}
              >
                カスタム
              </div>
            </div>
          ),
        }}
      />
      <ModalReminderCustom
        isOpen={isCustomModal}
        close={() => {
          setIsCustomModal(false);
        }}
        endDatetime={endDatetime}
        addNewValue={(newValue: any) => {
          // check if the new value exists
          const currentOptionValues = options.map((_) => _.value);
          if (!currentOptionValues.includes(newValue.value)) {
            setOptions([newValue, ...options]);
          }
        }}
      />
    </>
  );
};

const RepetitionSelect = ({
  rrule,
  setRrule,
}: {
  rrule: string;
  setRrule: (newValue: string) => void;
}) => {
  const [isCustomModal, setIsCustomModal] = useState(false);
  const [options, setOptions] = useState(REPETITION_OPTIONS);
  // const [value, setValue] = useState(REPETITION_OPTIONS[0]);

  useEffect(() => {
    if (options.length === 0) {
    } else if (!rrule || rrule == '') {
      setRrule(options[0].value);
    } else {
      const optionsIncluded = options.filter((item) => item.value === rrule);
      if (optionsIncluded.length > 0) {
        setRrule(optionsIncluded[0].value);
      } else {
        const rruleList = rrule.split(';');
        const returnData: any = {
          FREQ: '',
          BYDAY: '',
          INTERVAL: 1,
          UNTIL: '',
        };

        rruleList.forEach((rule: string) => {
          const [name, value] = rule.split('=');
          if (name == 'FREQ') {
            returnData.FREQ =
              value == 'YEARLY'
                ? '年'
                : value == 'MONTHLY'
                ? 'ヶ月'
                : value == 'WEEKLY'
                ? '週'
                : '日';
          } else if (name == 'BYDAY') {
            const weekdaysEn =
              value.split(',').length > 0
                ? value
                    .split(',')
                    .map(
                      (weekday: string) =>
                        WEEKDAYS_JP[WEEKDAYS_EN.indexOf(weekday)],
                    )
                : [];
            returnData.BYDAY = weekdaysEn.join('と');
          } else if (name === 'INTERVAL') {
            returnData[name] = parseInt(value);
          } else if (name === 'UNTIL') {
            returnData[name] = `${parseInt(value.substr(4, 2))}月${parseInt(
              value.substr(6, 2),
            )}日まで`;
          }
        });
        const newValue = {
          label: `毎${returnData.INTERVAL === 1 ? '' : returnData.INTERVAL}${
            returnData.FREQ
          }${returnData.BYDAY}${
            returnData.UNTIL ? `,${returnData.UNTIL}` : ''
          }`,
          value: rrule,
        };

        setOptions([...options, newValue]);
      }
    }
  }, [options, rrule, setRrule]);

  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);

  return (
    <>
      <Select
        instanceId="repetition-select"
        styles={{
          ...defaultSelectStyles,
          control: (provided) => ({
            ...provided,
            paddingLeft: '16px',
            paddingRight: '16px',
            height: '44px',
            border: 'none',
            boxShadow: 'none',
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '0px',
            backgroundColor: '#f9f9f9',
          }),
          menu: (provided) => ({
            ...provided,
            height: '200px',
            overflow: 'auto',
            // position: 'absolute',
          }),
          menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
        }}
        isMulti={false}
        options={options}
        menuPortalTarget={(() => {
          if (windowRef.current) {
            return windowRef.current.document.body;
          }
          return undefined;
        })()}
        value={(() => {
          const currentRrule = rrule !== '' ? rrule : '-1';
          const currentValue = options.filter((_) => _.value == currentRrule);

          return currentValue.length > 0
            ? currentValue[0]
            : options[options.length - 1];
        })()}
        onChange={(newValue) => {
          if (newValue) {
            setRrule(newValue.value);
          }
        }}
        isSearchable={false}
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
          Option: (props) => {
            return !props.isDisabled ? (
              <div
                {...props.innerProps}
                className="px-16px py-12px rounded-6px text-fontPrimary body1 hover:bg-primaryHovered hover:text-primary cursor-pointer"
              >
                {props.data.label}
              </div>
            ) : null;
          },
          MenuList: (props: any) => (
            <div className="body1">
              {props.children}
              <div
                className="px-16px py-12px body1 text-fontSecondary cursor-pointer"
                onClick={() => {
                  setIsCustomModal(true);
                }}
              >
                カスタム
              </div>
            </div>
          ),
        }}
      />
      <ModalRepetitionCustom
        isOpen={isCustomModal}
        close={() => {
          setIsCustomModal(false);
        }}
        addNewValue={(newValue: any) => {
          const currentOptionValues = options.map((_) => _.value);

          if (!currentOptionValues.includes(newValue.value)) {
            setOptions([...options, newValue]);
          } else {
            setOptions([...options]);
          }
        }}
      />
    </>
  );
};

const ColorSelect = ({
  value,
  setValue,
}: {
  value: number;
  setValue: (newValue: number) => void;
}) => {
  return (
    <Select
      instanceId="schedule-color-select"
      styles={{
        ...defaultSelectStyles,
        container: (provided) => ({
          ...provided,
          marginLeft: '2px',
          width: '100%',
        }),
        control: (provided) => ({
          ...provided,
          height: '44px',
          paddingRight: '16px',
          border: 'none',
          boxShadow: 'none',
          borderTopRightRadius: '8px',
          borderBottomRightRadius: '8px',
          borderTopLeftRadius: '0px',
          borderBottomLeftRadius: '0px',
          backgroundColor: '#f9f9f9',
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 10000,
        }),
      }}
      isMulti={false}
      value={COLOR_VALUES[value] ?? COLOR_VALUES[0]}
      options={COLOR_VALUES}
      onChange={(newValue) => {
        if (newValue) {
          setValue(parseInt(newValue?.value));
        }
      }}
      isSearchable={false}
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
        Option: (props) => {
          return props.isDisabled ? null : !props.isFocused ? (
            <div
              className="h-44px w-49px rounded-6px flex-xy-center"
              {...props.innerProps}
            >
              <div
                className={`h-20px w-20px rounded-full bg-${props.data.label}`}
              />
            </div>
          ) : (
            <div
              {...props.innerProps}
              className="h-44px w-49px rounded-6px bg-primarySelected flex-xy-center"
            >
              <div className="rounded-full border-3/2 border-primary flex-xy-center">
                <div className="rounded-full border-3/2 border-backgroundSecondary flex-xy-center">
                  <div
                    className={`h-14px w-14px rounded-full bg-${props.data.label}`}
                  />
                </div>
              </div>
            </div>
          );
        },
        SingleValue: (props) => {
          return (
            <components.SingleValue {...props}>
              <div
                className={`mx-12px h-20px w-20px rounded-full bg-${props.selectProps.getOptionLabel(
                  props.data,
                )} flex-xy-center`}
              />
            </components.SingleValue>
          );
        },
        MenuList: COLOR_MENULIST,
      }}
    />
  );
};

const ScheduleShareSelect = ({
  values,
  setValues,
  availableUserIDs,
}: {
  values: number[];
  setValues: (newValue: number[]) => void;
  availableUserIDs: number[];
}) => {
  const members = useSelector(membersSelector);
  const guests = useSelector(guestsSelector);
  const groups = useSelector(groupsSelector);

  const memberOptions = useMemo(() => {
    if (availableUserIDs.length == 0) return [];
    const membersFiltered = members.filter((_) =>
      availableUserIDs.includes(_.id),
    );

    return membersFiltered.map((_) => ({
      label: _.name,
      value: _.id.toString(),
      avatar: _.avatar,
      color: _.pivot?.color,
      type: 0,
    }));
  }, [members, availableUserIDs]);
  const guestOptions = useMemo(() => {
    if (availableUserIDs.length == 0) return [];
    const guestsFiltered = guests.filter((_) =>
      availableUserIDs.includes(_.id),
    );

    return guestsFiltered.map((_) => ({
      label: _.name,
      value: _.id.toString(),
      avatar: _.avatar,
      color: _.pivot?.color,
      type: 1,
    }));
  }, [guests, availableUserIDs]);
  const groupOptions = useMemo(() => {
    if (availableUserIDs.length == 0) return [];
    const groupsFiltered = groups.filter((_) => {
      if (!_.users || _.users.length == 0) {
        return false;
      }
      _.users.forEach((user) => {
        if (!availableUserIDs.includes(user.id)) return false;
      });
      return true;
    });

    return groupsFiltered.map((_) => ({
      label: _.name,
      value: _.id.toString(),
      users: _.users,
      type: 2,
    }));
  }, [groups, availableUserIDs]);

  const [currentType, setCurrentType] = useState(0);
  const [open, setOpen] = useState(false);
  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);

  return (
    <Select
      instanceId="schedule-share-select"
      isMulti={true}
      menuPlacement={'top'}
      menuPosition={'absolute'}
      styles={{
        ...defaultSelectStyles,
        control: (provided) => ({
          ...provided,
          paddingLeft: '16px',
          paddingRight: '16px',
          flex: 1,
          height: '44px',
          border: 'none',
          boxShadow: 'none',
          borderTopRightRadius: '8px',
          borderBottomRightRadius: '8px',
          borderTopLeftRadius: '0px',
          borderBottomLeftRadius: '0px',
          backgroundColor: '#f9f9f9',
        }),
        valueContainer: (provided) => ({
          ...provided,
          overflow: 'hidden',
          // width: '380px !important',
          height: '44px !important',
        }),
        multiValue: (provided) => ({
          ...provided,
          height: '44px',
          backgroundColor: '#f9f9f9',
        }),
        menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
      }}
      value={(() => {
        let currentValues: any[] = [];
        if (memberOptions.length > 0) {
          currentValues = [
            ...memberOptions.filter((_) => values.includes(parseInt(_.value))),
          ];
        }
        if (groupOptions.length > 0) {
          currentValues = [
            ...currentValues,
            ...groupOptions.filter((_) => values.includes(parseInt(_.value))),
          ];
        }
        return currentValues;
      })()}
      menuIsOpen={open}
      onMenuOpen={() => setOpen(true)}
      onMenuClose={() => setOpen(false)}
      onChange={(newValue) => {
        if (newValue.length === 0) {
          setValues([]);
        } else {
          let newIDs: number[] = [];
          newValue.map((_: any) => {
            if (_.type === 2) {
              const idsForGroup =
                _.users.length > 0 ? _.users.map((user: any) => user.id) : [];
              newIDs = [...newIDs, ...idsForGroup];
            } else {
              newIDs = [...newIDs, parseInt(_.value)];
            }
          });
          setValues(newIDs);
        }
      }}
      options={
        currentType === 0
          ? memberOptions
          : currentType === 1
          ? guestOptions
          : currentType === 2
          ? groupOptions
          : []
      }
      isSearchable={false}
      menuPortalTarget={(() => {
        if (windowRef.current) {
          return windowRef.current.document.body;
        }
        return undefined;
      })()}
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
        ClearIndicator: () => null,
        IndicatorSeparator: () => null,
        Placeholder: (props) => {
          return (
            <components.Placeholder {...props}>
              <div className="body1 text-fontSecondary">共有なし</div>
            </components.Placeholder>
          );
        },
        Option: (props) => {
          if (props.isDisabled) {
            return null;
          }
          if (currentType === 2) {
            // @ts-ignore
            const usersIDs = props.data.users.map((_) => _.id);
            const isSelected =
              usersIDs.filter((_: number) => !values.includes(_)).length === 0;
            if (isSelected) return null;
            return (
              <div
                {...props.innerProps}
                className={`p-12px flex-row--between cursor-pointer hover:bg-primarySelected hover:text-primary text-fontPrimary`}
              >
                <span className="ml-16px body1">{props.label}</span>
                <GroupUsersIconList
                  users={
                    // @ts-ignore
                    props.data.users
                  }
                  groupId={parseInt(props.data.value)}
                />
              </div>
            );
          } else {
            if (values.includes(parseInt(props.data.value))) return null;
            return (
              <div
                {...props.innerProps}
                className={`p-12px flex items-center cursor-pointer hover:bg-primarySelected hover:text-primary text-fontPrimary`}
              >
                <div
                  className={`relative w-22px h-22px rounded-full border-1/2 border-${
                    // @ts-ignore
                    props.data.color ? COLOR_VALUES[props.data.color] : 'pink'
                  } flex-xy-center`}
                >
                  <Image
                    src={
                      // @ts-ignore
                      props.data.avatar && props.data.avatar != ''
                        ? // @ts-ignore
                          props.data.avatar
                        : DefaultAvatarIcon
                    }
                    width={20}
                    height={20}
                    alt=""
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="ml-16px body1">{props.label}</div>
              </div>
            );
          }
        },
        MultiValueContainer: (props) => {
          return (
            <div className={`flex-xy-center ${props.innerProps.className}`}>
              <div
                className={`relative w-22px h-22px rounded-full border-1/2 border-${
                  // @ts-ignore
                  props.data.color ? COLOR_VALUES[props.data.color] : 'pink'
                } flex-xy-center`}
              >
                <Image
                  src={
                    // @ts-ignore
                    props.data.avatar && props.data.avatar != ''
                      ? // @ts-ignore
                        props.data.avatar
                      : DefaultAvatarIcon
                  }
                  width={20}
                  height={20}
                  alt=""
                  className="rounded-full object-cover"
                />
              </div>
              <div className="ml-8px mr-16px body1 whitespace-nowrap">
                {props.data.label}
              </div>
            </div>
          );
        },
        MenuList: (props: any) => {
          return (
            <div className="px-12px h-240px body1 overflow-y-scroll">
              <div
                className="p-12px body1 text-fontSecondary cursor-pointer hover:bg-primarySelected hover:text-primary"
                onClick={() => {
                  setValues([]);
                  setOpen(false);
                }}
              >
                共有なし
              </div>
              <div className="h-44px rounded-6px bg-backgroundPrimary body1 text-fontSecondary flex items-center cursor-pointer">
                <div
                  className={`flex-1 flex-xy-center ${
                    currentType === 0 ? 'text-fontPrimary' : ''
                  }`}
                  onClick={() => setCurrentType(0)}
                >
                  <span>メンバー</span>
                </div>
                <div
                  className={`flex-1 flex-xy-center ${
                    currentType === 1 ? 'text-fontPrimary' : ''
                  }`}
                  onClick={() => setCurrentType(1)}
                >
                  <span>ゲスト</span>
                </div>
                <div
                  className={`flex-1 flex-xy-center ${
                    currentType === 2 ? 'text-fontPrimary' : ''
                  }`}
                  onClick={() => setCurrentType(2)}
                >
                  <span>グループ</span>
                </div>
              </div>
              <div className="pt-12px">
                <div
                  className={`p-12px flex items-center text-fontPrimary cursor-pointer hover:bg-primarySelected hover:text-primary`}
                  onClick={() => {
                    if (currentType === 0) {
                      const memberIDs =
                        members.length > 0 ? members.map((_) => _.id) : [];
                      const idsToAdd =
                        memberIDs.length > 0
                          ? memberIDs.filter((_) => !values.includes(_))
                          : [];
                      setValues([...values, ...idsToAdd]);
                    } else if (currentType === 1) {
                      const guestIDs =
                        guests.length > 0 ? guests.map((_) => _.id) : [];
                      const idsToAdd =
                        guestIDs.length > 0
                          ? guestIDs.filter((_) => !values.includes(_))
                          : [];
                      setValues([...values, ...idsToAdd]);
                    } else {
                      let idsForAllGroups: number[] = [];
                      groups.map((_) => {
                        const currentUserIDs: number[] =
                          _.users.length > 0
                            ? _.users.map((user: any) => user.id)
                            : [];
                        const idsToAdd =
                          currentUserIDs.length > 0
                            ? currentUserIDs.filter((_) => !values.includes(_))
                            : [];
                        idsForAllGroups = [...idsForAllGroups, ...idsToAdd];
                      });
                      setValues([...values, ...idsForAllGroups]);
                    }
                    setOpen(false);
                  }}
                >
                  <div className="relative w-22px h-22px rounded-full bg-separator flex-xy-center">
                    <AllUsersIcon className="w-14px h-14px" />
                  </div>
                  <div className="ml-16px body1">
                    {currentType === 0
                      ? 'メンバー全員'
                      : currentType === 1
                      ? 'ゲスト全員'
                      : '全グループ'}
                  </div>
                </div>
                {props.children}
              </div>
            </div>
          );
        },
        NoOptionsMessage: () => (
          <div className="px-24px py-12px">オプションはありません</div>
        ),
      }}
    />
  );
};

const ProcessSelect = ({
  value,
  setValue,
  instanceId,
}: {
  value: number;
  setValue: (newValue: number) => void;
  instanceId: number;
}) => {
  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);

  return (
    <Select
      instanceId={`process-status-for-${instanceId}nd-day`}
      styles={{
        ...defaultSelectStyles,
        control: (provided) => ({
          ...provided,
          height: '20px',
          width: '100%',
          border: 'none',
          boxShadow: 'none',
        }),
        menu: (provided) => ({
          ...provided,
          width: '200px',
          paddingTop: '12px',
          paddingBottom: '12px',
        }),
        menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
      }}
      options={TASK_EXECUTION_STATUS_OPTIONS}
      value={(() => {
        const filtered = TASK_EXECUTION_STATUS_OPTIONS.filter(
          (option) => option.value == value.toString(),
        );
        return filtered.length > 0 ? filtered[0] : undefined;
      })()}
      menuPortalTarget={(() => {
        if (windowRef.current) {
          return windowRef.current.document.body;
        }
        return undefined;
      })()}
      isSearchable={false}
      onChange={(newValue: any) => {
        setValue(parseInt(newValue.value));
      }}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
        Option: (props) => {
          return !props.isDisabled ? (
            <ProcessRow
              status={
                // @ts-ignore
                parseInt(props.value)
              }
              label={props.label}
              {...props.innerProps}
            />
          ) : null;
        },
        Placeholder: (props) => {
          return (
            <components.Placeholder {...props}>
              <div className="flex items-center">
                <UncheckedIcon
                  width={20}
                  height={20}
                  className="text-primary"
                />
                <span className="ml-16px body1 text-fontSecondary">未設定</span>
              </div>
            </components.Placeholder>
          );
        },
        SingleValue: (props) => {
          return (
            <components.SingleValue {...props}>
              <div className="py-12px body1 flex items-center cursor-pointer">
                {(() => {
                  const currentStatus = parseInt(
                    // @ts-ignore
                    props.selectProps.value.value ?? '-1',
                  );
                  const Icon =
                    currentStatus === TASK_STATUS_A_DAY.DONE
                      ? CheckmarkIcon
                      : currentStatus === TASK_STATUS_A_DAY.UNDONE
                      ? MinusIcon
                      : currentStatus === TASK_STATUS_A_DAY.COMPLETED
                      ? CheckmarkFillIcon
                      : UncheckedIcon;

                  return (
                    <>
                      <Icon width={20} height={20} className="text-primary" />
                      <span
                        className={`ml-16px ${
                          currentStatus === -1 ||
                          currentStatus === TASK_STATUS_A_DAY.UNDONE
                            ? 'text-fontSecondary'
                            : 'text-fontPrimary'
                        }
                        }`}
                      >
                        {props.selectProps.getOptionLabel(props.data)}
                      </span>
                    </>
                  );
                })()}
              </div>
            </components.SingleValue>
          );
        },
        MenuList: (props) => {
          return <div className="px-12px">{props.children}</div>;
        },
      }}
    />
  );
};

export const HourSelect = ({
  value,
  setValue,
  instanceId,
}: {
  value: number;
  setValue: (newValue: number) => void;
  instanceId: number;
}) => {
  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);

  const [options, setOptions] = useState<any[]>(
    HOURS_A_DAY_LIST.map((_: number) => ({
      label: getHourMinFormat(_),
      value: _.toString(),
    })),
  );
  useEffect(() => {
    const valuesList = options.map((_) => parseInt(_.value));
    if (!valuesList.includes(value)) {
      setOptions([
        {
          label: getHourMinFormat(value),
          value: value.toString(),
        },
        ...options,
      ]);
    }
  }, [value, options]);

  return (
    <Select
      instanceId={`hour-a-day-for-task-${instanceId}`}
      isMulti={false}
      styles={{
        ...defaultSelectStyles,
        control: (provided) => ({
          ...provided,
          height: '20px',
          width: '100%',
          border: 'none',
          boxShadow: 'none',
        }),
        menu: (provided) => ({
          ...provided,
          right: 0,
          width: '200px',
          maxHeight: '250px',
          overflow: 'auto',
        }),
        menuList: (provided) => ({
          ...provided,
          maxHeight: '200px',
          overflow: 'auto',
        }),
        menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
      }}
      menuPortalTarget={(() => {
        if (windowRef.current) {
          return windowRef.current.document.body;
        }
        return undefined;
      })()}
      options={options}
      value={{
        label: getHourMinFormat(value),
        value: value.toString(),
      }}
      isSearchable={false}
      onChange={(newValue: any) => {
        setValue(parseInt(newValue.value));
      }}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
        Option: (props) => {
          return !props.isDisabled ? (
            <div
              className="py-12px px-18px rounded-8px body1-en text-fontPrimary hover:bg-backgroundPrimary cursor-pointer"
              {...props.innerProps}
            >
              {props.label}
            </div>
          ) : null;
        },
        MenuList: (props) => <div className="p-12px">{props.children}</div>,
        SingleValue: (props) => {
          return (
            <components.SingleValue {...props}>
              <div className="body1-en text-primary">
                {props.selectProps.getOptionLabel(props.data)}
              </div>
            </components.SingleValue>
          );
        },
      }}
    />
  );
};

const RepetitionPeriodTimesSelect = ({
  value,
  setValue,
}: {
  value: number;
  setValue: (newValue: number) => void;
}) => {
  return (
    <Select
      instanceId="repetition-period-times-select"
      isMulti={false}
      value={
        value <= REPETITION_PERIOD_TIMES_LIST.length
          ? {
              label: REPETITION_PERIOD_TIMES_LIST[value - 1].toString(),
              value: REPETITION_PERIOD_TIMES_LIST[value - 1].toString(),
            }
          : {
              label: '1',
              value: '1',
            }
      }
      onChange={(newValue) => setValue(parseInt(newValue?.value ?? '1'))}
      styles={{
        ...defaultSelectStyles,
        container: (provided) => ({
          ...provided,
          width: '78px',
        }),
        control: (provided, state) => ({
          ...provided,
          paddingLeft: '16px',
          paddingRight: '16px',
          height: '44px',
          border: 'none',
          boxShadow: 'none',
          borderTopLeftRadius: '7px',
          borderBottomLeftRadius: '7px',
          borderTopRightRadius: '0px',
          borderBottomRightRadius: '0px',
          backgroundColor: state.isFocused ? '#0000001A' : '#f9f9f9',
        }),
        menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
      }}
      options={REPETITION_PERIOD_TIMES_LIST.map((_) => {
        const value = _.toString();
        return {
          label: value,
          value,
        };
      })}
      menuPortalTarget={(() => {
        if (typeof window === undefined) {
          return undefined;
        }
        return window.document.body;
      })()}
      isSearchable={false}
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
  );
};

const RepetitionPeriodTypeSelect = ({
  value,
  setValue,
}: {
  value?: any;
  setValue: (newValue: any) => void;
}) => {
  return (
    <Select
      instanceId="repetition-period-type-select"
      styles={{
        ...defaultSelectStyles,
        container: (provided) => ({
          ...provided,
          width: '100%',
        }),
        control: (provided, state) => ({
          ...provided,
          paddingLeft: '16px',
          paddingRight: '16px',
          height: '44px',
          border: 'none',
          boxShadow: 'none',
          borderTopRightRadius: '8px',
          borderBottomRightRadius: '8px',
          borderTopLeftRadius: '0px',
          borderBottomLeftRadius: '0px',
          backgroundColor: state.isFocused ? '#0000001A' : '#f9f9f9',
        }),
        menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
      }}
      options={REPETITION_PERIOD_TYPES_OPTIONS}
      value={
        value
          ? REPETITION_PERIOD_TYPES_OPTIONS.filter(
              (_) => _.value === value,
            )[0] ?? REPETITION_PERIOD_TYPES_OPTIONS[1]
          : REPETITION_PERIOD_TYPES_OPTIONS[1]
      }
      onChange={(newValue: any) => {
        setValue(newValue.value);
      }}
      // defaultValue={}
      isSearchable={false}
      menuPortalTarget={(() => {
        if (typeof window === undefined) {
          return undefined;
        }
        return window.document.body;
      })()}
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
  );
};

const WeekdayMultiSelect = ({
  values,
  setValues,
}: {
  values: number[];
  setValues: (newValue: number[]) => void;
}) => {
  return (
    <Select
      styles={{
        ...defaultSelectStyles,
        control: (provided, state) => ({
          ...provided,
          paddingLeft: '16px',
          paddingRight: '16px',
          height: '44px',
          border: 'none',
          boxShadow: 'none',
          borderRadius: '8px',
          backgroundColor: state.isFocused ? '#0000001A' : '#f9f9f9',
        }),
        menuPortal: (base: any) => ({
          ...base,
          zIndex: 10001,
        }),
      }}
      isMulti={true}
      isSearchable={false}
      placeholder={<div className="body1 text-fontSecondary">曜日</div>}
      value={WEEKDAY_OPTIONS.filter((_) => values.includes(parseInt(_.value)))}
      menuPortalTarget={(() => {
        if (typeof window === undefined) {
          return undefined;
        }
        return window.document.body;
      })()}
      options={WEEKDAY_OPTIONS}
      onChange={(newValue: any) => {
        if (newValue.length > 0) {
          const newArray = newValue.map((_: any) => parseInt(_.value));
          setValues(newArray.sort());
        } else {
          setValues([]);
        }
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
        MultiValueLabel: (props) => {
          const currentLabel = props.selectProps.getOptionLabel(props.data);
          return (
            <components.MultiValueLabel {...props}>
              {currentLabel.charAt(0)}
            </components.MultiValueLabel>
          );
        },
      }}
    />
  );
};

export const BulkRequestSelect = ({
  values,
  setValue,
  additionalClass,
  role,
  open,
  setOpen,
  onBulkSelect,
  availableUserIDs,
}: {
  values: number[];
  setValue: (newValues: number | null) => void;
  additionalClass: string;
  role: number;
  open: boolean;
  setOpen: (newValue: boolean) => void;
  onBulkSelect: () => void;
  availableUserIDs?: number[];
}) => {
  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);
  const membersList = useSelector(membersSelector);
  const guestsList = useSelector(guestsSelector);
  const [tab, setTab] = useState(0);

  const members = useMemo(() => {
    if (membersList.length == 0) {
      return [];
    }
    const filtered = membersList.filter((_) =>
      availableUserIDs?.includes(_.id),
    );
    return filtered.length == 0
      ? []
      : filtered.map((member) => ({
          value: member.id.toString(),
          label: member.name,
          avatar: member.avatar,
        }));
  }, [membersList, availableUserIDs]);
  const guests = useMemo(() => {
    if (guestsList.length == 0) {
      return [];
    }
    const filtered = guestsList.filter((_) => availableUserIDs?.includes(_.id));
    return filtered.length == 0
      ? []
      : filtered.map((member) => ({
          value: member.id.toString(),
          label: member.name,
          avatar: member.avatar,
        }));
  }, [guestsList, availableUserIDs]);

  return (
    <div className={additionalClass}>
      <Select
        instanceId="bulk-request-type-select"
        menuIsOpen={open}
        onMenuOpen={() => setOpen(true)}
        onMenuClose={() => setOpen(false)}
        isMulti={false}
        options={tab === 0 ? members : guests}
        value={(() => {
          const allUsers = [...members, ...guests];
          if (values.length === 0 || allUsers.length === 0) return undefined;
          const filteredUsers = allUsers.filter((item) =>
            values.includes(parseInt(item.value)),
          );
          return filteredUsers.length === 0 ? undefined : filteredUsers[0];
        })()}
        isSearchable={false}
        placeholder={
          <span className={`body1 text-fontSecondary`}>依頼なし</span>
        }
        // @ts-ignore
        styles={{
          ...defaultSelectStyles,
          container: (provided) => ({
            ...provided,
          }),
          control: (provided, state) => ({
            ...provided,
            paddingLeft: '16px',
            paddingRight: '16px',
            height: '44px',
            border: 'none',
            boxShadow: 'none',
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '0px',
            backgroundColor: state.isFocused ? '#0000001A' : '#f9f9f9',
          }),
          menu: (provided) => ({
            ...provided,
            zIndex: 10000,
            maxHeight: 400,
            overflowY: 'scroll',
          }),
          menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
          menuList: (base: any) => ({
            ...base,
            padding: '12px',
            border: '1px solid red',
          }),
        }}
        menuPlacement={'top'}
        menuPosition={'absolute'}
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
          NoOptionsMessage: () => (
            <div className="px-24px py-12px">オプションはありません</div>
          ),
          MenuList: (props) => {
            return (
              <div className="w-full">
                <div
                  className="p-12px rounded-6px body1 text-fontPrimary hover:bg-primarySelected hover:text-primary cursor-pointer"
                  onClick={() => {
                    setValue(null);
                    setOpen(false);
                  }}
                >
                  {role === 2 ? '依頼なし' : '再依頼なし'}
                </div>
                <div className="p-12px rounded-6px bg-backgroundPrimary body1 text-fontSecondary flex-row--between">
                  <div className="flex">
                    <span
                      className={`cursor-pointer ${
                        tab == 0 ? 'text-fontPrimary' : ''
                      }`}
                      onClick={() => setTab(0)}
                    >
                      メンバー
                    </span>
                    <span
                      className={`ml-12px cursor-pointer ${
                        tab == 1 ? 'text-fontPrimary' : ''
                      }`}
                      onClick={() => setTab(1)}
                    >
                      ゲスト
                    </span>
                  </div>
                  <div
                    className={`text-${
                      role === 1 ? 'primary' : 'primarySelected'
                    } cursor-pointer`}
                    onClick={() => {
                      if (role === 1) {
                        onBulkSelect();
                      }
                    }}
                  >
                    まとめて依頼
                  </div>
                </div>
                <div className="">{props.children}</div>
              </div>
            );
          },
          Option: (props) => {
            return !props.isDisabled ? (
              <div
                className="p-12px rounded-6px text-fontPrimary flex flex-row items-center hover:bg-primarySelected hover:text-primary cursor-pointer"
                {...props.innerProps}
              >
                <Image
                  src={(() => {
                    // @ts-ignore
                    const avatar = props.data.avatar;
                    return avatar && avatar != '' ? avatar : DEFAULT_AVATAR_URL;
                  })()}
                  width={20}
                  height={20}
                  alt=""
                  className="rounded-full object-cover"
                />
                <span className="ml-12px body1">{props.label}</span>
              </div>
            ) : null;
          },
          SingleValue: (props) => {
            return (
              <components.SingleValue {...props}>
                <div className="py-12px flex flex-row items-center cursor-pointer">
                  <Image
                    src={
                      // @ts-ignore
                      props.avatar && props.avatar != ''
                        ? // @ts-ignore
                          props.avatar
                        : DefaultAvatarIcon
                    }
                    width={20}
                    height={20}
                    alt=""
                    className="rounded-full object-cover"
                  />
                  <span className="ml-12px body1 text-fontPrimary">
                    {
                      // @ts-ignore
                      props.selectProps.getOptionLabel(props.data)
                    }
                  </span>
                </div>
              </components.SingleValue>
            );
          },
        }}
      />
    </div>
  );
};

const GroupSelect = ({
  groupIDs,
  setGroupIDs,
  disabled,
}: {
  groupIDs: number[];
  setGroupIDs: (newValue: number[]) => void;
  disabled: boolean;
}) => {
  const groups = useSelector(groupsSelector);

  const [menuOpen, setMenuOpen] = useState(false);
  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);
  const dispatch = useDispatch();

  return (
    <Select
      menuIsOpen={menuOpen}
      onMenuOpen={() => setMenuOpen(true)}
      onMenuClose={() => setMenuOpen(false)}
      openMenuOnClick={true}
      isMulti={true}
      isSearchable={false}
      styles={{
        ...groupsSelectStyle,
        clearIndicator: (provided) => ({
          ...provided,
          marginRight: '8px',
        }),
        menuList: (provided) => ({
          ...provided,
          maxHeight: '300px',
        }),
        menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
        multiValue: (provided) => ({
          ...provided,
          background: 'none',
        }),
      }}
      value={(() => {
        if (groupIDs.length === 0) {
          return [];
        } else if (groupIDs.length === 1 && groupIDs[0] === -1) {
          return GROUP_DEFAULT_OPTIONS;
        } else {
          const selectedGroups = groups.filter((group: any) =>
            groupIDs.includes(group.id),
          );
          return selectedGroups.length === 0
            ? []
            : selectedGroups.map((_) => ({
                label: _.name,
                value: _.id.toString(),
                collabUsers: _.users,
              }));
        }
      })()}
      menuPortalTarget={(() => {
        if (windowRef.current) {
          return windowRef.current.document.body;
        }
        return undefined;
      })()}
      isDisabled={disabled}
      onChange={(e) => {
        if (e && Array.isArray(e) && e.length > 0) {
          const values = e.map((_) => parseInt(_.value));
          if (values.includes(-1)) {
            setMenuOpen(false);
            setGroupIDs([-1]);
            // setValue('groups', -1);
          } else {
            setGroupIDs(values);
            // setValue('groups', values[0]);
          }
        } else {
          setGroupIDs([]);
          // setValue('groups', undefined);
        }
      }}
      options={(() => {
        const groupOptions =
          groups.length > 0
            ? groups.map((_) => ({
                label: _.name,
                value: _.id.toString(),
                collabUsers: _.users,
              }))
            : [];

        return [...GROUP_DEFAULT_OPTIONS, ...groupOptions];
      })()}
      placeholder={
        <span className="body1 text-fontSecondary">所属グループ</span>
      }
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
        MenuList: (props) => (
          <GROUP_MENULIST
            {...props}
            onClose={() => {
              setMenuOpen(false);
            }}
            onAddGroup={() => {
              setMenuOpen(false);
              dispatch(setGroupUserSelectModal(true));
            }}
          />
        ),
        MultiValueContainer: (props) => {
          return (
            <div className={props.innerProps.className}>{props.data.label}</div>
          );
        },
        Option: (props) => {
          let isDisabled = groupIDs ? groupIDs.length === 0 : false;
          if (props.data.value === '-1') {
            isDisabled = !disabled && groupIDs.length > 0;
          }
          // @ts-ignore
          const groupUsers = props.data.collabUsers;
          // @ts-ignore
          return !props.isDisabled ? (
            <div
              {...props.innerProps}
              onClick={(e) => {
                if (disabled) {
                } else if (props.innerProps.onClick) {
                  props.innerProps.onClick(e);
                }
              }}
              className={`mx-12px p-12px rounded-8px flex-row--between cursor-pointer ${
                disabled
                  ? 'text-fontSecondary hover:bg-backgroundPrimary'
                  : 'text-fontPrimary hover:bg-primarySelected hover:text-primary'
              }`}
            >
              <span className="">{props.data.label}</span>
              <div className="flex flex-row">
                <GroupUsersIconList
                  users={groupUsers}
                  groupId={parseInt(props.data.value)}
                />
              </div>
            </div>
          ) : null;
        },
        Control: (props) => {
          return (
            <components.Control {...props}>
              <div
                className="w-full h-full flex-xy-center"
                onClick={() => {
                  setMenuOpen((old: boolean) => !old);
                }}
              >
                {props.children}
              </div>
            </components.Control>
          );
        },
      }}
    />
  );
};

interface InputProps {
  value: string;
  onClick: () => void;
}

export const ScheduleStartTimeSelect = ({
  value,
  onChange,
  isTimeMode24,
}: {
  value: Dayjs;
  onChange: (newValue: Date) => void;
  isTimeMode24: boolean;
}) => {
  return (
    <DatePicker
      selected={value.toDate()}
      onChange={onChange}
      className="text-fontPrimary text-13px"
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption={''}
      dateFormat={isTimeMode24 ? 'HH:mm' : 'h:mm aa'}
      timeFormat={isTimeMode24 ? 'HH:mm' : 'h:mm aa'}
      locale="ja"
      // customInput={CustomInput}
    />
  );
};

export const ScheduleEndTimeSelect = ({
  startTime,
  value,
  onChange,
  isTimeMode24,
}: {
  startTime: Dayjs;
  value: Dayjs;
  onChange: (newValue: Date) => void;
  isTimeMode24: boolean;
}) => {
  const isBeforeStartTime = useCallback(
    (newStartTime: Dayjs) => (time: Date) => {
      if (time.getHours() == 0 && time.getMinutes() == 0) return true;
      const newDate = dayjs(time);
      return (
        newDate.isAfter(newStartTime, 'day') ||
        newDate.hour() > newStartTime.hour() ||
        (newDate.hour() == newStartTime.hour() &&
          newDate.minute() > newStartTime.minute())
      );
    },
    [],
  );

  return (
    <DatePicker
      selected={
        value.hour() == 23 && value.minute() == 59 && value.second() == 59
          ? value.add(1, 'second').toDate()
          : value.toDate()
      }
      onChange={onChange}
      className="text-fontPrimary text-13px	 flex-0"
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption={''}
      dateFormat={isTimeMode24 ? 'HH:mm' : 'h:mm aa'}
      timeFormat={isTimeMode24 ? 'HH:mm' : 'h:mm aa'}
      filterTime={isBeforeStartTime(startTime)}
      locale="ja"
    />
  );
};

export const CountLimitSelect = ({
  value,
  onChange,
  type,
}: {
  value: number;
  onChange: (newValue: number) => void;
  type: string;
}) => {
  return (
    <Select
      instanceId={`count-limit-${type}`}
      styles={{
        ...defaultSelectStyles,
        container: (provided) => ({
          ...provided,
          height: '20px',
        }),
        control: (provided) => ({
          ...provided,
          height: '20px',
          minHeight: 'unset',
          border: 'none',
          boxShadow: 'none',
          backgroundColor: '#fff',
        }),
        menu: (provided) => ({
          ...provided,
          marginLeft: '-28px',
          width: '68px',
          height: 'auto',
          padding: '0',
        }),
        menuList: (provided) => ({
          ...provided,
          borderWidth: 1,
          borderColor: 'blue',
          height: 'auto',
        }),
      }}
      options={COUNT_LIMIT_OPTIONS}
      value={
        value >= 0 && value < COUNT_LIMIT_OPTIONS.length
          ? COUNT_LIMIT_OPTIONS[value]
          : COUNT_LIMIT_OPTIONS[1]
      }
      isSearchable={false}
      onChange={(newValue: any) => {
        onChange(parseInt(newValue.value));
      }}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
        MenuList: (props: any) => (
          <div className="p-12px">{props.children}</div>
        ),
        Option: (props) => {
          return (
            <div
              {...props.innerProps}
              className="px-18px py-12px rounded-6px text-center text-fontPrimary flex-xy-center cursor-pointer hover:bg-primarySelected hover:text-primary"
            >
              <span>{props.data.label}</span>
            </div>
          );
        },
        SingleValue: (props) => {
          const isZero = props.selectProps.getOptionValue(props.data) === '0';
          return (
            <components.SingleValue {...props}>
              <div className={isZero ? 'text-fontSecondary' : 'text-primary'}>
                {props.selectProps.getOptionLabel(props.data)}
              </div>
            </components.SingleValue>
          );
        },
      }}
    />
  );
};

export const ViewModeSelect = ({
  value,
  onChange,
}: {
  value: 'month' | 'weeks4' | 'weeks2' | 'half' | 'week';
  onChange: (newValue: 'month' | 'weeks4' | 'weeks2' | 'half' | 'week') => void;
}) => {
  return (
    <Select
      isMulti={false}
      instanceId={`view-mode-select`}
      isSearchable={false}
      value={VIEWMODE_OPTIONS.filter((item) => item.value === value)[0]}
      options={VIEWMODE_OPTIONS}
      onChange={(newValue) => {
        if (newValue) {
          onChange(
            newValue.value as 'month' | 'weeks4' | 'weeks2' | 'half' | 'week',
          );
        }
      }}
      styles={{
        ...defaultSelectStyles,
        control: (provided, state) => ({
          ...provided,
          paddingLeft: '3px',
          paddingRight: '9px',
          height: '24px',
          border: '1px solid #eaeaea',
          boxShadow: 'none',
          borderRadius: '4px',
          backgroundColor: state.isFocused ? '#eaeaea' : '#fff',
        }),
        menu: (provided) => ({
          ...provided,
          right: '-50%',
          width: '200%',
          zIndex: 60,
          overflow: 'auto',
        }),
        valueContainer: (provided) => ({
          ...provided,
          textAlign: 'center',
          fontSize: '14px',
        }),
      }}
      components={{
        DropdownIndicator: ({ innerProps, isDisabled }) => {
          return !isDisabled ? (
            <DownTriangleIcon
              {...innerProps}
              width={20}
              height={20}
              className="absolute right-0 caption2 text-fontSecondary"
            />
          ) : null;
        },
        IndicatorSeparator: () => null,
        Option: (props) => {
          return !props.isDisabled ? (
            <div
              {...props.innerProps}
              className="px-16px py-12px rounded-6px text-center text-fontPrimary hover:bg-primaryHovered hover:text-primary cursor-pointer flex-row--between"
            >
              <span> {props.data.label}</span>
              <span className="body1">
                {props.data.value === 'month'
                  ? 'M'
                  : props.data.value === 'week'
                  ? 'W'
                  : props.data.value === 'weeks2'
                  ? 'F'
                  : 'X'}
              </span>
            </div>
          ) : null;
        },
      }}
    />
  );
};

export {
  ImportanceSelect,
  RequiredTimeSelect,
  ReminderSelect,
  RepetitionSelect,
  ColorSelect,
  ScheduleShareSelect,
  ProcessSelect,
  RepetitionPeriodTimesSelect,
  RepetitionPeriodTypeSelect,
  WeekdayMultiSelect,
  GroupSelect,
};

const ProcessRow = ({
  status,
  label,
  ...rest
}: {
  status: number;
  label: string;
}) => {
  return (
    <div
      className="p-12px rounded-8px body1 hover:bg-primarySelected hover:text-primary flex items-center cursor-pointer"
      {...rest}
    >
      {status === TASK_STATUS_A_DAY.DONE ? (
        <CheckmarkIcon width={20} height={20} className="text-primary" />
      ) : status === TASK_STATUS_A_DAY.UNDONE ? (
        <MinusIcon width={20} height={20} className="text-primary" />
      ) : (
        <CheckmarkFillIcon width={20} height={20} className="text-primary" />
      )}
      <span
        className={`ml-16px ${
          status === 1 ? 'text-fontSecondary' : 'text-fontPrimary'
        }`}
      >
        {label}
      </span>
    </div>
  );
};

// export const ScheduleStartTimeSelect = ({
//   value,
//   onChange,
//   isTimeMode24,
// }: {
//   value: Dayjs;
//   onChange: (newValue: Dayjs) => void;
//   isTimeMode24: boolean;
// }) => {
//   const renderOptions = useMemo(() => {
//     const numberArray = Array.from(new Array(96), (x, i) => i);

//     const currentTime = dayjs();
//     const resultArray: Array<{
//       label: string;
//       value: string;
//     }> = [];
//     numberArray.forEach((currentNumber) => {
//       const totalMins = currentNumber * 15;
//       const hour = Math.floor(totalMins / 60);
//       const min = totalMins % 60;

//       const tempTime = currentTime.hour(hour).minute(min);
//       resultArray.push({
//         label: isTimeMode24
//           ? tempTime.format('HH:mm')
//           : tempTime.format('hh:mma'),
//         value: tempTime.unix().toString(),
//       });
//     });
//     return resultArray;
//   }, [isTimeMode24]);
//   const currentValue = useMemo(() => {
//     const currentLabel = isTimeMode24
//       ? value.format('HH:mm')
//       : value.format('hh:mma');
//     const filtered = renderOptions.filter((item) => {
//       return item.label === currentLabel;
//     });
//     return filtered[0] ?? renderOptions[0];
//   }, [value, renderOptions, isTimeMode24]);

//   const windowRef = useRef<Window | null>();
//   useEffect(() => {
//     if (windowRef && typeof window !== undefined) {
//       windowRef.current = window;
//     }
//   }, [windowRef]);
//   return (
//     <Select
//       isMulti={false}
//       instanceId={`schedule-starttime-select`}
//       isSearchable={true}
//       value={currentValue}
//       options={renderOptions}
//       onChange={(newValue) => {
//         if (newValue) {
//           onChange(dayjs.unix(parseInt(newValue.value)));
//         }
//       }}
//       styles={{
//         ...defaultSelectStyles02,
//         control: (provided) => ({
//           ...provided,
//           paddingLeft: '2px',
//           paddingRight: '2px',
//           height: '44px',
//           width: '68px',
//           border: 'none',
//           boxShadow: 'none',
//           borderTopRightRadius: '8px',
//           borderBottomRightRadius: '8px',
//           borderTopLeftRadius: '0px',
//           borderBottomLeftRadius: '0px',
//           backgroundColor: '#f9f9f9',
//         }),
//         menu: (provided) => ({
//           ...provided,
//           height: '300px',
//           width: '125px',
//           overflow: 'auto',
//         }),
//         menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
//       }}
//       menuPortalTarget={(() => {
//         if (windowRef.current) {
//           return windowRef.current.document.body;
//         }
//         return undefined;
//       })()}
//       components={{
//         DropdownIndicator: () => null,
//         IndicatorSeparator: () => null,
//       }}
//     />
//   );
// };

// export const ScheduleEndTimeSelect = ({
//   startTime,
//   value,
//   onChange,
//   isTimeMode24,
// }: {
//   startTime: Dayjs;
//   value: Dayjs;
//   onChange: (newValue: Dayjs) => void;
//   isTimeMode24: boolean;
// }) => {
//   const renderOptions = useMemo(() => {
//     const startDate = startTime.date();
//     const resultArray: Array<{
//       label: string;
//       value: string;
//     }> = [];
//     let tempTime = startTime.clone();
//     while (tempTime.date() === startDate) {
//       resultArray.push({
//         label: isTimeMode24
//           ? tempTime.format('HH:mm')
//           : tempTime.format('hh:mma'),
//         value: tempTime.unix().toString(),
//       });
//       tempTime = tempTime.add(15, 'minute');
//     }

//     return resultArray;
//   }, [isTimeMode24, startTime]);
//   const currentValue = useMemo(() => {
//     const currentLabel = isTimeMode24
//       ? value.format('HH:mm')
//       : value.format('hh:mma');
//     const filtered = renderOptions.filter((item) => {
//       return item.label === currentLabel;
//     });
//     return filtered[0] ?? renderOptions[0];
//   }, [value, renderOptions, isTimeMode24]);

//   const windowRef = useRef<Window | null>();
//   useEffect(() => {
//     if (windowRef && typeof window !== undefined) {
//       windowRef.current = window;
//     }
//   }, [windowRef]);
//   return (
//     <Select
//       isMulti={false}
//       instanceId={`schedule-endtime-select`}
//       isSearchable={true}
//       value={currentValue}
//       options={renderOptions}
//       onChange={(newValue) => {
//         if (newValue) {
//           onChange(dayjs.unix(parseInt(newValue.value)));
//         }
//       }}
//       styles={{
//         ...defaultSelectStyles02,
//         control: (provided) => ({
//           ...provided,
//           paddingLeft: '2px',
//           paddingRight: '2px',
//           height: '44px',
//           width: '68px',
//           border: 'none',
//           boxShadow: 'none',
//           borderTopRightRadius: '8px',
//           borderBottomRightRadius: '8px',
//           borderTopLeftRadius: '0px',
//           borderBottomLeftRadius: '0px',
//           backgroundColor: '#f9f9f9',
//         }),
//         menu: (provided) => ({
//           ...provided,
//           height: '300px',
//           width: '125px',
//           overflow: 'auto',
//         }),
//         menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
//       }}
//       menuPortalTarget={(() => {
//         if (windowRef.current) {
//           return windowRef.current.document.body;
//         }
//         return undefined;
//       })()}
//       components={{
//         DropdownIndicator: () => null,
//         IndicatorSeparator: () => null,
//       }}
//     />
//   );
// };
