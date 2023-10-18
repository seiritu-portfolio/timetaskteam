import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { DefaultInputWrap } from '@component/general/input';
import MagnifyGlassIcon from '@svg/magnifyingglass-big.svg';
import CloseIcon from '@svg/multiply.svg';
import CircledCloseIcon from '@svg/multiply-circle-fill-small.svg';
import ArrowLeftIcon from '@svg/chevron-left.svg';

interface Props {
  title: string;
  hasSearch?: boolean;
  onBack?: any;
  setSearch?: any;
}

const SettingsHeader = ({
  title,
  hasSearch = false,
  onBack,
  setSearch,
}: Props) => {
  const [onSearch, setOnSearch] = useState(false);
  const [inputReset, setInputReset] = useState(false);

  const { register, getValues, reset } = useForm({
    defaultValues: {
      search: '',
    },
  });

  const { ref, name, onChange, onBlur } = register('search');

  return (
    <div className="flex-none setting-header h-72px">
      {onSearch ? (
        <div
          className="mr-24px h-44px w-44px rounded-8px bg-backgroundPrimary text-fontPrimary flex justify-center items-center"
          onClick={() => {
            setOnSearch(false);
            setSearch('');
            reset();
          }}
        >
          <CloseIcon
            className="text-fontPrimary cursor-pointer"
            width={20}
            height={20}
          />
        </div>
      ) : (
        <div className="flex flex-row items-center">
          {onBack && (
            <ArrowLeftIcon
              className="cursor-pointer"
              width={20}
              height={20}
              onClick={onBack}
            />
          )}
          <h2
            className={`${onBack ? 'ml-24px' : ''} big-title text-fontPrimary`}
          >
            {title}
          </h2>
        </div>
      )}
      <div className={`${onSearch ? 'w-full ' : ''}flex flex-row items-center`}>
        {hasSearch ? (
          onSearch ? (
            <DefaultInputWrap additionalPositionClass="flex-1 mr-32px">
              <input
                name={name}
                ref={ref}
                type="text"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const newValue = getValues('search');
                    setSearch(newValue);
                  }
                }}
                onChange={(e) => {
                  onChange(e);
                  if (e.target.value !== '') {
                    setInputReset(true);
                  } else {
                    setInputReset(false);
                  }
                }}
                onBlur={onBlur}
                className="flex-1 button text-fontPrimary focus:outline-none bg-backgroundPrimary"
              />
              {inputReset ? (
                <CircledCloseIcon
                  width="20"
                  height="20"
                  className="text-fontSecondary"
                  onClick={() => {
                    reset();
                    setInputReset(false);
                    setSearch('');
                  }}
                />
              ) : null}
            </DefaultInputWrap>
          ) : (
            <div className="mr-36px h-44px w-44px rounded-8px bg-backgroundTertiary text-fontPrimary flex-xy-center">
              <MagnifyGlassIcon
                className="cursor-pointer"
                width={24}
                height={24}
                onClick={() => {
                  reset();
                  setOnSearch(true);
                  setSearch('');
                }}
              />
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default SettingsHeader;
