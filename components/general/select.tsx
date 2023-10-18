import { useEffect, useRef } from 'react';
import Select from 'react-select';

import DownTriangleIcon from '@svg/triangle-small.svg';
import defaultSelectStyles from '@util/selectConfig';

const DefaultSelect = ({
  value,
  options,
  onChange,
}: {
  value: any;
  options: any[];
  onChange: any;
}) => (
  <Select
    styles={defaultSelectStyles}
    defaultValue={value}
    isSearchable={false}
    options={options}
    onChange={onChange}
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

export const DefaultSelect1 = ({
  value,
  options,
  onChange,
  isOptionDisabled,
}: {
  value: any;
  options: any[];
  onChange: any;
  isOptionDisabled?: any;
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
          maxHeight: '250px',
          overflow: 'auto',
        }),
        menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
      }}
      value={value}
      isSearchable={false}
      options={options}
      onChange={onChange}
      menuPortalTarget={(() => {
        if (windowRef.current) {
          return windowRef.current.document.body;
        }
        return undefined;
      })()}
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
      isOptionDisabled={isOptionDisabled}
    />
  );
};

export const DefaultSelect2 = ({
  value,
  options,
  onChange,
  isOptionDisabled,
}: {
  value: any;
  options: any[];
  onChange: any;
  isOptionDisabled?: any;
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
          maxHeight: '250px',
          overflow: 'auto',
        }),
        menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
      }}
      value={value}
      isSearchable={false}
      options={options}
      onChange={onChange}
      menuPlacement={'top'}
      menuPortalTarget={(() => {
        if (windowRef.current) {
          return windowRef.current.document.body;
        }
        return undefined;
      })()}
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
      isOptionDisabled={isOptionDisabled}
    />
  );
};

export const DefaultMultiSelect = ({
  value,
  options,
  onChange,
  isOptionDisabled,
  ...rest
}: {
  value: any;
  options: any[];
  onChange: any;
  isOptionDisabled?: any;
  placeholder?: any;
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
        menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
        multiValue: (provided) => ({
          ...provided,
          flex: 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          height: 32,
          alignItems: 'center',
        }),
        valueContainer: (provided) => ({
          ...provided,
          overflow: 'hidden',
          height: '44px',
          paddingTop: 6,
          paddingBottom: 6,
        }),
        menuList: (provided) => ({
          ...provided,
          maxHeight: '200px',
          overflow: 'auto',
        }),
      }}
      menuPortalTarget={(() => {
        if (windowRef.current) {
          return windowRef.current.document.body;
        }
        return undefined;
      })()}
      isMulti
      value={value}
      isSearchable={false}
      options={options}
      onChange={onChange}
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
          <div className="px-24px py-12px text-fontSecondary">
            オプションはありません
          </div>
        ),
        MultiValueRemove: () => null,
      }}
      isOptionDisabled={isOptionDisabled}
      {...rest}
    />
  );
};

export default DefaultSelect;
