import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Select, { components } from 'react-select';

import { userInfoSelector } from '@store/selectors/user';
import DownTriangleIcon from '@svg/triangle-small.svg';
import defaultSelectStyles from '@util/selectConfig';
import { REMINDER_CUSTOM_TIME_OPTIONS } from '@util/selectOptions';

const TimeSelect = ({
  className,
  isDisabled,
  change,
  value,
}: {
  className: string;
  isDisabled: boolean;
  change: any;
  value: string;
}) => {
  const { user } = useSelector(userInfoSelector);
  const timeMode24: boolean = useMemo(() => {
    if (user?.time_display) {
      return user?.time_display == 2;
    } else {
      return false;
    }
  }, [user]);

  return (
    <div className={`${className}`}>
      <Select
        instanceId="time-select"
        styles={defaultSelectStyles}
        options={REMINDER_CUSTOM_TIME_OPTIONS}
        value={(() => {
          const filtered = REMINDER_CUSTOM_TIME_OPTIONS.filter(
            (_) => _.value == value,
          );
          return filtered.length > 0
            ? filtered[0]
            : REMINDER_CUSTOM_TIME_OPTIONS[12];
        })()}
        isDisabled={isDisabled}
        isSearchable={false}
        onChange={(e: any) => {
          change(e.value);
        }}
        components={{
          DropdownIndicator: (innerProps, isDisabled) =>
            !isDisabled ? (
              <DownTriangleIcon
                {...innerProps}
                width={20}
                height={20}
                className="ml-4px caption2 text-fontSecondary"
              />
            ) : null,
          IndicatorSeparator: () => null,
          Option: (props) => (
            <components.Option {...props}>
              {timeMode24 ? props.data.value : props.data.label}
            </components.Option>
          ),
          SingleValue: (props) => (
            <components.SingleValue {...props}>
              {timeMode24
                ? props.selectProps.getOptionValue(props.data)
                : props.selectProps.getOptionLabel(props.data)}
            </components.SingleValue>
          ),
        }}
      />
    </div>
  );
};

export default TimeSelect;
