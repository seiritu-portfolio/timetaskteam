import { useState } from 'react';
import { useSelector } from 'react-redux';

import { emailSelector, userInfoSelector } from '@store/selectors/user';
import { DefaultInputWrap } from '@component/general/input';
import CircledCloseIcon from '@svg/multiply-circle-fill-small.svg';

export const EmailInput = ({
  defaultValue,
  register,
  reset,
  setChange,
  change,
}: {
  defaultValue: string;
  register: any;
  reset: (registerName: string) => void;
  setChange: (state: boolean) => void;
  change?: (newValue: string) => void;
}) => {
  const currentEmail = useSelector(emailSelector);
  const { ref, name, onChange, onBlur } = register('email', {
    required: true,
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: '有効なメールアドレスを入力してください。',
    },
  });
  const [inputNameReset, setInputNameReset] = useState(false);

  return (
    <DefaultInputWrap additionalPositionClass="mt-12px">
      <input
        name={name}
        ref={ref}
        type="text"
        onChange={(e) => {
          onChange(e);
          const newValue = e.target.value;
          if (newValue !== '' && newValue !== currentEmail) {
            if (change) change(newValue);
            setInputNameReset(true);
            setChange(true);
          } else {
            setInputNameReset(false);
            setChange(false);
          }
        }}
        onBlur={(e) => {
          onBlur(e);
        }}
        defaultValue={defaultValue}
        placeholder="メールアドレス"
        className="w-full bg-backgroundPrimary focus:outline-none"
      />
      {inputNameReset ? (
        <CircledCloseIcon
          width="21"
          height="20"
          className="text-fontSecondary"
          onClick={() => {
            reset('email');
            setInputNameReset(false);
          }}
        />
      ) : null}
    </DefaultInputWrap>
  );
};

export const NameInput = ({
  defaultValue,
  register,
  reset,
  setChange,
  change,
}: {
  defaultValue: string;
  register: any;
  reset: (registerName: string) => void;
  setChange: (state: boolean) => void;
  change?: (newValue: string) => void;
}) => {
  const userInfo = useSelector(userInfoSelector);
  const { ref, name, onChange, onBlur } = register('name', { required: true });
  const [inputNameReset, setInputNameReset] = useState(false);

  return (
    <DefaultInputWrap additionalPositionClass="mt-12px">
      <input
        name={name}
        ref={ref}
        type="text"
        onChange={(e) => {
          onChange(e);
          const newValue = e.target.value;
          if (newValue !== '' && newValue !== userInfo.user?.name) {
            setInputNameReset(true);
            if (change) change(newValue ?? '');
            setChange(true);
          } else {
            setInputNameReset(false);
            setChange(false);
          }
        }}
        onBlur={onBlur}
        defaultValue={defaultValue}
        placeholder="ネーム"
        className="w-full bg-backgroundPrimary focus:outline-none"
      />
      {inputNameReset ? (
        <CircledCloseIcon
          width="21"
          height="20"
          className="text-fontSecondary cursor-pointer"
          onClick={() => {
            reset('name');
            setInputNameReset(false);
          }}
        />
      ) : null}
    </DefaultInputWrap>
  );
};
