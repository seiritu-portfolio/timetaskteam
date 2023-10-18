const DefaultMenuItem = ({
  text,
  className,
  onClick,
}: {
  text: string;
  className: string;
  onClick: () => void;
}) => {
  return (
    <div
      className={`p-12px rounded-6px truncate hover:bg-primarySelected hover:text-primary ${className}`}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default DefaultMenuItem;
