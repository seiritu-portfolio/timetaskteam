const RequestHandlerRow = ({
  text,
  icon,
  color,
  onClick,
}: {
  text: string;
  icon: any;
  color: string;
  onClick: () => void;
}) => {
  const Icon = icon;

  return (
    <div
      className={`py-12px text-${color} flex-row--between cursor-pointer`}
      onClick={onClick}
    >
      <span className="">{text}</span>
      <Icon width={20} height={20} />
    </div>
  );
};

export default RequestHandlerRow;
