import { useEffect, useRef } from 'react';
import Select from 'react-select';
import defaultSelectStyles from '@util/selectConfig';

import DownTriangleIcon from '@svg/triangle-small.svg';
import { OCCUPANCYRATE_MENULIST } from '@util/selectComponents';
import { REFLECT_OCCUPANCY_OPTIONS } from '@util/selectOptions';

const OccupancySelect = ({
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
  const windowRef = useRef<Window | null>();
  useEffect(() => {
    if (windowRef && typeof window !== undefined) {
      windowRef.current = window;
    }
  }, [windowRef]);

  return (
    <>
      <Select
        styles={{
          ...defaultSelectStyles,
          menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
        }}
        isMulti={false}
        value={
          value || value === 0 ? REFLECT_OCCUPANCY_OPTIONS[value] : undefined
        }
        isSearchable={false}
        menuPortalTarget={(() => {
          if (windowRef.current) {
            return windowRef.current.document.body;
          }
          return undefined;
        })()}
        options={REFLECT_OCCUPANCY_OPTIONS}
        placeholder={
          <span className="body1 text-fontSecondary">稼働率への反映</span>
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
          MenuList: OCCUPANCYRATE_MENULIST,
        }}
        onChange={(e) => {
          if (e?.value) {
            setValue(parseInt(e.value));
            changeValue(e.value);
          } else {
            setValue(null);
            changeValue(null);
          }
        }}
      />
      <input
        {...register('occupancyValidate', { required: true })}
        type="hidden"
        defaultValue={noValidate ? 0 : undefined}
      />
      {hasError && (
        <p className="mt-8px body1 text-secondary">
          稼働率への反映を選択してください
        </p>
      )}
    </>
  );
};

export default OccupancySelect;
