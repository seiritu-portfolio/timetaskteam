import { useState } from 'react';
import { DefaultInputWrap } from '@component/general/input';
import CircledCloseIcon from '@svg/multiply-circle-fill-small.svg';

const NameInput = ({
  register,
  defaultValue,
  changeValue,
  reset,
  hasError,
  placeholder,
  additionalClass,
}: {
  register: any;
  defaultValue?: string;
  changeValue?: (newValue: string) => void;
  reset: () => void;
  hasError: boolean;
  placeholder?: string;
  additionalClass: string;
}) => {
  const [inputNameReset, setInputNameReset] = useState(false);
  const { ref, name, onChange, onBlur } = register('name', {
    required: true,
  });
  return (
    <>
      <DefaultInputWrap additionalPositionClass={additionalClass}>
        <input
          name={name}
          ref={ref}
          type="text"
          defaultValue={defaultValue}
          onChange={(e) => {
            onChange(e);
            if (changeValue) {
              changeValue(e.target.value);
            }
            // setValue('name', e.target.value);
            if (e.target.value !== '') {
              setInputNameReset(true);
            } else {
              setInputNameReset(false);
            }
          }}
          onBlur={onBlur}
          placeholder={placeholder ?? 'リスト名'}
          className="w-full bg-backgroundPrimary focus:outline-none"
        />
        {inputNameReset ? (
          <CircledCloseIcon
            width="21"
            height="20"
            className="text-fontSecondary"
            onClick={() => {
              reset();
              setInputNameReset(false);
            }}
          />
        ) : null}
      </DefaultInputWrap>
      {hasError && (
        <p className="mt-8px body1 text-secondary">
          リスト名が入力されていません。
        </p>
      )}
    </>
  );
};

export default NameInput;
