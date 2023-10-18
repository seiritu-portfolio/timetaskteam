export const IconWrap = (props: any) => (
  <div
    className={`${
      props.additionalClass ? props.additionalClass : ''
    } h-44px w-44px rounded-8px flex-xy-center`}
    onClick={props.onClick ?? (() => {})}
  >
    {props.children}
  </div>
);

export const IconWrapForCalendar = (props: any) => (
  <div
    className={`${
      props.additionalClass ? props.additionalClass : ''
    } h-36px w-36px rounded-8px flex-xy-center`}
    onClick={props.onClick ?? (() => {})}
  >
    {props.children}
  </div>
);

export const IconWrapForCalendar02 = ({
  Icon,
  iconSize,
  tooltiptext,
  additionalClass,
  tooltipClass,
  onClick,
}: {
  Icon: any;
  iconSize: number;
  tooltiptext?: string;
  additionalClass?: string;
  tooltipClass?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      className={`${
        additionalClass ? additionalClass : ''
      } h-36px w-36px rounded-8px flex-xy-center ${
        tooltiptext ? 'tooltip' : ''
      }`}
      onClick={onClick ?? (() => {})}
    >
      <Icon width={iconSize} height={iconSize} className="flex-0" />
      {tooltiptext ? (
        <span
          className={`absolute top-full mt-1 px-2 py-1 w-20 ${
            tooltipClass ?? ''
          } rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext`}
        >
          {tooltiptext}
        </span>
      ) : null}
    </div>
  );
};

export const IconWrap01 = ({
  Icon,
  className,
  ...props
}: {
  Icon: any;
  className: string;
  [x: string]: any;
}) => {
  return (
    <div
      className={`h-44px w-44px rounded-l-8px bg-backgroundPrimary flex-xy-center ${className}`}
      {...props}
    >
      <Icon width={20} height={20} />
    </div>
  );
};

export const IconWrap02 = ({
  Icon,
  className,
  ...props
}: {
  Icon: any;
  className: string;
  [x: string]: any;
}) => {
  return (
    <div
      className={`h-44px w-44px rounded-8px bg-backgroundPrimary flex-xy-center ${className}`}
      {...props}
    >
      <Icon width={20} height={20} />
    </div>
  );
};
