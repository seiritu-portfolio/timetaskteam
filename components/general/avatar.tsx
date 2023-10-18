import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import CircledCloseIcon from '@svg/multiply-circle-fill-small.svg';
import CheckedIcon from '@svg/checkmark-square-fill.svg';
import UncheckedIcon from '@svg/square.svg';
import DefaultAvatarIcon from '@image/default_avatar.png';
import { DEFAULT_AVATAR_URL } from '@util/urls';

interface AvatarType {
  styleClass: string;
  imgSrc: string;
  color?: string;
  hideBorder?: boolean;
}

interface AvatarExtendedType extends AvatarType {
  styleClass: string;
  imgSrc: string;
  tooltip?: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

interface AvatarExtended4SelectType extends AvatarType {
  selected: boolean;
  tooltip?: string;
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const AvatarImage = (props: AvatarType) => {
  const [src, setSrc] = useState(props.imgSrc);
  useEffect(() => {
    setSrc(props?.imgSrc);
  }, [props.imgSrc]);

  return (
    <div
      className={`${
        props.styleClass
      } relative w-44px h-44px rounded-full border-${
        props.hideBorder ? '0' : `1/2 border-${props.color}`
      }  flex-xy-center`}
    >
      <div className="h-40px w-40px rounded-full border-1/2 border-separator">
        <Image
          src={src != null && src != '' ? src : DEFAULT_AVATAR_URL}
          blurDataURL={DEFAULT_AVATAR_URL}
          onError={() => setSrc(DEFAULT_AVATAR_URL)}
          width={40}
          height={40}
          alt=""
          className="rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export const AvatarImageClickable = (props: AvatarExtendedType) => {
  return (
    <div
      className={`${
        props.styleClass
      } flex-none relative w-44px h-44px rounded-full border-${
        props.hideBorder ? '0' : `1/2 border-${props.color}`
      } flex-xy-center cursor-pointer tooltip`}
      onClick={props.onClick}
    >
      <div className="h-40px w-40px rounded-full border-1/2 border-separator">
        <Image
          src={
            props.imgSrc && props.imgSrc !== ''
              ? props.imgSrc
              : DefaultAvatarIcon
          }
          width={40}
          height={40}
          alt=""
          className="rounded-full object-cover"
        />
      </div>
      {props.tooltip ? (
        <span className="absolute top-full mt-1 w-20 px-2 py-1 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext truncate">
          {props?.tooltip}
        </span>
      ) : null}
    </div>
  );
};

const AvatarImageClosable = (props: AvatarExtendedType) => {
  return (
    <div
      className={`${props.styleClass} relative w-44px h-44px rounded-full border-1/2 border-${props.color} flex-xy-center`}
    >
      <Image
        src={
          props.imgSrc && props.imgSrc !== '' ? props.imgSrc : DefaultAvatarIcon
        }
        width={40}
        height={40}
        alt=""
        className="rounded-full object-cover"
      />
      <div
        className="absolute -right-1 -bottom-1 h-20px w-20px rounded-full bg-backgroundSecondary cursor-pointer"
        onClick={props.onClick}
      >
        <CircledCloseIcon
          width="20"
          height="20"
          className="text-fontSecondary"
        />
      </div>
    </div>
  );
};

const AvatarImageSelectable = (props: AvatarExtended4SelectType) => {
  return (
    <div
      className={`${
        props.styleClass
      } relative flex-none w-44px h-44px rounded-full border-1/2 border-${
        props.color
      } flex-xy-center cursor-pointer ${props.tooltip ? 'tooltip' : ''}`}
      onClick={props.disabled ? () => {} : props.onClick}
    >
      <Image
        src={
          props.imgSrc && props.imgSrc !== '' ? props.imgSrc : DefaultAvatarIcon
        }
        width={40}
        height={40}
        alt=""
        className="rounded-full object-cover"
      />
      <div className="absolute -right-1 -bottom-1 h-20px w-20px rounded-sm bg-backgroundSecondary flex-xy-center">
        {props.selected ? (
          <CheckedIcon
            width={20}
            height={20}
            className={`text-${props.color ?? 'pink'}`}
          />
        ) : (
          <UncheckedIcon
            width={20}
            height={20}
            className={`text-${props.color ?? 'pink'}`}
          />
        )}
      </div>
      {props.tooltip ? (
        <span className="absolute top-full mt-1 w-20 px-2 py-1 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext truncate">
          {props?.tooltip}
        </span>
      ) : null}
    </div>
  );
};

export const AvatarSelectable2 = (props: AvatarExtended4SelectType) => {
  return (
    <div
      className={`${props.styleClass} relative w-44px h-44px rounded-full border-1/2 border-${props.color} flex-xy-center cursor-pointer`}
      onClick={props.onClick}
    >
      <Image
        src={
          props.imgSrc && props.imgSrc !== '' ? props.imgSrc : DefaultAvatarIcon
        }
        width={40}
        height={40}
        alt=""
        className="rounded-full object-cover"
      />
      <div className="absolute -right-1 -bottom-1 h-20px w-20px rounded-sm bg-backgroundSecondary flex-xy-center">
        {props.selected ? (
          <CheckedIcon width={20} height={20} className={`text-primary`} />
        ) : (
          <UncheckedIcon width={20} height={20} className={`text-primary`} />
        )}
      </div>
    </div>
  );
};

export default AvatarImage;
export { AvatarImageClosable, AvatarImageSelectable };
