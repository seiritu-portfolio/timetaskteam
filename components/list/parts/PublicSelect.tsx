import { useEffect, useRef } from 'react';
import Select, { components } from 'react-select';
import { listPublicSelectStyles } from '@util/selectConfig';

import DownTriangleIcon from '@svg/triangle-small.svg';
import { IS_PUBLIC_OPTIONS } from '@util/selectOptions';

const PublicSelect = ({
  value,
  setValue,
  register,
  hasError,
  changeValue,
  noValidate,
}: {
  value: number | null;
  setValue: (newValue: number | null) => void;
  register: any;
  hasError: boolean;
  changeValue: (newValue: any) => void;
  noValidate?: boolean;
}) => {
  const currentValue = IS_PUBLIC_OPTIONS.filter((item) => item.value === value);
  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);

  return (
    <>
      <Select
        value={currentValue[0] ?? undefined}
        options={IS_PUBLIC_OPTIONS}
        styles={{
          ...listPublicSelectStyles,
          menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
        }}
        isSearchable={false}
        menuPortalTarget={(() => {
          if (windowRef.current) {
            return windowRef.current.document.body;
          }
          return undefined;
        })()}
        placeholder={<span className="body1 text-fontSecondary">公開設定</span>}
        isMulti={false}
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
            // @ts-ignore
            const Icon = props.data.icon;
            return !props.isDisabled ? (
              <div
                {...props.innerProps}
                className="mx-12px p-12px rounded-6px flex flex-row items-center hover:bg-primarySelected hover:text-primary"
              >
                <Icon width={20} height={20} />
                <span className="ml-16px">{props.data.label}</span>
              </div>
            ) : null;
          },
          SingleValue: (props) => {
            // @ts-ignore
            const Icon = props.selectProps.value.icon ?? null;
            const label = props.selectProps.getOptionLabel(props.data);
            return (
              <components.SingleValue {...props}>
                <div className="flex flex-row items-center">
                  <Icon width={20} height={20} />
                  <span className="ml-16px">{label}</span>
                </div>
              </components.SingleValue>
            );
          },
        }}
        onChange={(e) => {
          const newValue = e?.value || e?.value === 0 ? e.value : null;

          setValue(newValue);
          changeValue(newValue);
        }}
      />
      <input
        {...register('isPublicValidate', { required: true })}
        type="hidden"
        defaultValue={noValidate ? 0 : undefined}
      />
      {hasError && (
        <p className="mt-8px body1 text-secondary">
          公開/非公開を選択してください。
        </p>
      )}
    </>
  );
};

export default PublicSelect;
