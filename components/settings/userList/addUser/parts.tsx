import { useEffect, useRef } from 'react';
import Select, { components } from 'react-select';

import AvatarImage from '@component/general/avatar';
import { DEFAULT_AVATAR_URL } from '@util/urls';
import DownTriangleIcon from '@svg/triangle-small.svg';
import defaultSelectStyles from '@util/selectConfig';
import { MEMBER_TYPE_OPTIONS } from '@util/selectOptions';
import { COLOR_VALUES } from '@util/constants';

export const CollaboAvatar = ({
  imgSrc,
  color,
  name,
  uuid,
  additionalClass,
}: {
  imgSrc?: string;
  color?: string;
  name: string;
  uuid?: string;
  additionalClass?: string;
}) => {
  return (
    <div
      className={`mt-24px py-24px w-full min-h-120px border-box flex flex-col justify-center items-center ${
        additionalClass ?? ''
      }`}
    >
      <AvatarImage
        styleClass=""
        imgSrc={imgSrc && imgSrc != '' ? imgSrc : DEFAULT_AVATAR_URL}
        color={color ?? 'pink'}
      />
      <div className="mt-4px body1">{name}</div>
      {uuid && <div className="body1 text-primary">{uuid}</div>}
    </div>
  );
};

export const RoleSelect = ({
  disabled,
  value,
  onChange,
}: {
  disabled: boolean;
  value: number | undefined;
  onChange: (newValue: number) => void;
}) => {
  return (
    <Select
      styles={{
        ...defaultSelectStyles,
        singleValue: (provided) => {
          const color = '#000000DF';
          return { ...provided, color };
        },
      }}
      isMulti={false}
      options={MEMBER_TYPE_OPTIONS}
      placeholder={
        <span className="body1 text-fontSecondary">ユーザー属性</span>
      }
      value={value != null ? MEMBER_TYPE_OPTIONS[value - 1] : undefined}
      isDisabled={disabled}
      isSearchable={false}
      onChange={(e) => {
        if (e) {
          onChange(e.value === 'member' ? 1 : 2);
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
      }}
    />
  );
};

export const ColorSelect = ({
  disabled,
  value,
  onChange,
}: {
  disabled: boolean;
  value: number | null;
  onChange: (newValue: number) => void;
}) => {
  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);

  return (
    <Select
      styles={{
        ...defaultSelectStyles,
        menuList: (provided) => ({
          ...provided,
          maxHeight: '200px',
        }),
        menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
      }}
      options={COLOR_VALUES}
      isSearchable={false}
      placeholder={<span className="body1 text-fontSecondary">カラー</span>}
      menuPortalTarget={(() => {
        if (windowRef.current) {
          return windowRef.current.document.body;
        }
        return undefined;
      })()}
      isMulti={false}
      value={value != null ? COLOR_VALUES[value] : null}
      //   defaultValue={
      //     userToAdd.status === 'success' && userToAdd.data.data.pivot
      //       ? COLOR_VALUES[userToAdd.data.data.pivot.color]
      //       : null
      //   }
      isDisabled={disabled}
      onChange={(e) => {
        if (e && !Array.isArray(e)) {
          onChange(parseInt(e?.value));
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
        Option: (props) => {
          const colorName = props.children;

          return !props.isDisabled ? (
            <div
              {...props.innerProps}
              className="mx-12px px-12px py-8px rounded-sm flex-row--between hover:bg-primarySelected hover:text-primary"
            >
              <div className={`h-20px w-20px rounded-full bg-${colorName}`} />
            </div>
          ) : null;
        },
        SingleValue: (props) => (
          <components.SingleValue {...props}>
            <div
              className={`h-20px w-20px rounded-full bg-${props.selectProps.getOptionLabel(
                props.data,
              )}`}
            />
          </components.SingleValue>
        ),
      }}
    />
  );
};
