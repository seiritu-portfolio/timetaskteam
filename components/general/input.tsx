import React, { useRef, useState } from 'react';

// import { InputType } from "@model/input";

interface WrapPropType {
  children: React.ReactNode;
  height?: number;
  additionalPositionClass?: string;
  onClick?: () => void;
}

const DefaultInputWrap = ({
  children,
  height,
  additionalPositionClass,
  onClick = (e?: any) => {},
}: WrapPropType) => {
  return additionalPositionClass ? (
    <div className={`${additionalPositionClass} w-auto`}>
      <div
        className={`px-16px w-auto h-${
          height ?? 44
        }px rounded-8px bg-backgroundPrimary flex flex-row items-center`}
        onClick={onClick}
      >
        {children}
      </div>
    </div>
  ) : (
    <div
      className="px-16px w-full h-44px rounded-8px bg-backgroundPrimary flex flex-row items-center"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export { DefaultInputWrap, TextInput };

const TextInput = (props: any) => {
  const { className, register, name, required, placeholder } = props;

  const [isInput, setIsInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        {...register(name, { required })}
        placeholder={placeholder}
        onBlur={(e) => {
          if (spanRef.current) {
            spanRef.current.innerText = e.target?.value ?? '';
            setIsInput(false);
          }
        }}
        className={`${className} ${isInput ? 'w-full' : 'w-0 hidden'}`}
      />
      <div
        ref={spanRef}
        onClick={(_) => {
          setIsInput(true);
        }}
        className={`${className} ${isInput ? 'hidden w-0' : 'w-full'} truncate`}
      >
        {props.initValue ?? props.placeholder}
      </div>
    </>
  );
};
