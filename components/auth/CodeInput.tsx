// import { useState } from "react";
import { forwardRef, useEffect, useRef } from 'react';

import { setAuthCode } from '@store/modules/auth';
import { useDispatch, useSelector } from 'react-redux';
import { authInfoSelector } from '@store/selectors/auth';

const CodeInput = () => {
  const dispatch = useDispatch();
  const { authCode } = useSelector(authInfoSelector);

  const inputRef0 = useRef<HTMLInputElement | null>(null);
  const inputRef1 = useRef<HTMLInputElement | null>(null);
  const inputRef2 = useRef<HTMLInputElement | null>(null);
  const inputRef3 = useRef<HTMLInputElement | null>(null);
  const inputRef4 = useRef<HTMLInputElement | null>(null);
  const inputRef5 = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (authCode === '') {
      if (inputRef0.current) inputRef0.current.value = '';
      if (inputRef1.current) inputRef1.current.value = '';
      if (inputRef2.current) inputRef2.current.value = '';
      if (inputRef3.current) inputRef3.current.value = '';
      if (inputRef4.current) inputRef4.current.value = '';
      if (inputRef5.current) inputRef5.current.value = '';
    }
  }, [
    authCode,
    inputRef0,
    inputRef1,
    inputRef2,
    inputRef3,
    inputRef4,
    inputRef5,
  ]);

  const onValueEntered = (index: number) => {
    if (index < 5) {
      // * input with index is filled so should focus on the next one.
      const nextInput =
        index === 0
          ? inputRef1.current
          : index === 1
          ? inputRef2.current
          : index === 2
          ? inputRef3.current
          : index === 3
          ? inputRef4.current
          : inputRef5.current;
      nextInput?.focus();
      nextInput?.select();
    } else {
      // * check if all values r input, and if yes, all is done
      let temp = '';

      for (let i = 0; i < 6; i++) {
        const currentInput =
          i === 0
            ? inputRef0.current
            : i === 1
            ? inputRef1.current
            : i === 2
            ? inputRef2.current
            : i === 3
            ? inputRef3.current
            : i === 4
            ? inputRef4.current
            : inputRef5.current;
        const itemValue = currentInput?.value;
        if (itemValue && itemValue !== '') {
          temp += itemValue;
        } else {
          currentInput?.focus();
          currentInput?.select();
          return;
        }
      }

      dispatch(setAuthCode(temp));
    }
  };

  return (
    <div className="flex flex-row justify-center">
      <InputOne ref={inputRef0} index={0} onValueEntered={onValueEntered} />
      <InputOne
        ref={inputRef1}
        index={1}
        onValueEntered={onValueEntered}
        addonClass="ml-24px"
      />
      <InputOne
        ref={inputRef2}
        index={2}
        onValueEntered={onValueEntered}
        addonClass="ml-24px"
      />
      <InputOne
        ref={inputRef3}
        index={3}
        onValueEntered={onValueEntered}
        addonClass="ml-24px"
      />
      <InputOne
        ref={inputRef4}
        index={4}
        onValueEntered={onValueEntered}
        addonClass="ml-24px"
      />
      <InputOne
        ref={inputRef5}
        index={5}
        onValueEntered={onValueEntered}
        addonClass="ml-24px"
      />
    </div>
  );
};

export default CodeInput;

interface InputOneProps {
  index: number;
  onValueEntered: (_: number) => void;
  addonClass?: string;
}

// eslint-disable-next-line react/display-name
const InputOne = forwardRef<HTMLInputElement, InputOneProps>(
  ({ index, onValueEntered, addonClass }, ref) => {
    return (
      <input
        type="text"
        ref={ref}
        onChange={(e) => {
          onValueEntered(index);
        }}
        maxLength={1}
        className={`${addonClass} input-digit focus:outline-none`}
      />
    );
  },
);
