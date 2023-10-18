import { useEffect, useRef } from 'react';
import Select, { components } from 'react-select';
import { iconSelectStyles } from '@util/selectConfig';
import { ICON_VALUES } from '@util/constants';
import { ICON_MENULIST } from '@util/selectComponents';
import DownTriangleIcon from '@svg/triangle-small.svg';

const IconSelect = ({
  register,
  hasError,
  value,
  setValue,
  disabled,
  disabledRenderIcon,
  noValidate,
}: {
  register: any;
  hasError: boolean;
  changeValue: (newValue: any) => void;
  value: number | null;
  setValue: (newValue: number | null) => void;
  disabled?: boolean;
  disabledRenderIcon?: any;
  noValidate?: boolean;
}) => {
  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);

  useEffect(() => {
    if (disabled) {
      setValue(-1);
    }
  }, [setValue, disabled]);

  return (
    <>
      <Select
        isMulti={false}
        options={ICON_VALUES}
        styles={iconSelectStyles}
        isDisabled={disabled}
        value={value || value === 0 ? ICON_VALUES[value] : undefined}
        isSearchable={false}
        placeholder={<span className="body1 text-fontSecondary">アイコン</span>}
        menuPortalTarget={(() => {
          if (windowRef.current) {
            return windowRef.current.document.body;
          }
          return undefined;
        })()}
        onChange={(e) => {
          if (e && !Array.isArray(e)) {
            setValue(e.value);
          } else {
            setValue(null);
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
          MenuList: ICON_MENULIST,
          Option: (props) => {
            const Icon = props.data.icon;
            return !props.isDisabled ? (
              <div
                {...props.innerProps}
                className="w-44px h-44px rounded-6px flex-xy-center hover:bg-primarySelected hover:text-primary cursor-pointer"
              >
                <Icon width={21} height={20} />
              </div>
            ) : null;
          },
          SingleValue: (props) => {
            // @ts-ignore
            const Icon = props.selectProps.value?.icon ?? null;
            const DisabledRenderIcon = disabledRenderIcon;
            return disabled && disabledRenderIcon ? (
              <components.SingleValue {...props}>
                <DisabledRenderIcon width={21} height={20} />
              </components.SingleValue>
            ) : (
              <components.SingleValue {...props}>
                <Icon width={21} height={20} />
              </components.SingleValue>
            );
          },
        }}
      />
      <input
        {...register('iconValidate', { required: true })}
        type="hidden"
        defaultValue={noValidate ? 0 : undefined}
      />
      {hasError && (
        <p className="mt-8px body1 text-secondary">
          アイコンを選択してください
        </p>
      )}
    </>
  );
};

export default IconSelect;
