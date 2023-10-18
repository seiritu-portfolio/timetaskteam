import Select, { components } from 'react-select';
import { COLOR_VALUES } from '@util/constants';
import defaultSelectStyles from '@util/selectConfig';

import DownTriangleIcon from '@svg/triangle-small.svg';
import { COLOR_MENULIST } from '@util/selectComponents';

const ColorSelect = ({
  color,
  setColor,
}: {
  color: number;
  setColor: (newValue: number) => void;
}) => {
  return (
    <>
      <Select
        styles={{
          ...defaultSelectStyles,
        }}
        options={COLOR_VALUES}
        isMulti={false}
        isSearchable={false}
        value={COLOR_VALUES[color]}
        onChange={(e) => {
          if (e && !Array.isArray(e)) {
            setColor(parseInt(e.value));
          } else {
            setColor(0);
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
          MenuList: COLOR_MENULIST,
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
                  className={`h-20px w-20px rounded-full bg-${props.selectProps.getOptionLabel(
                    props.data,
                  )} flex-xy-center`}
                />
              </components.SingleValue>
            );
          },
        }}
      />
    </>
  );
};

export default ColorSelect;
