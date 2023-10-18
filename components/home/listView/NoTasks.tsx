import AddIcon from '@svg/add.svg';

const NoTasks = ({
  text,
  onClick,
  disabled,
}: {
  text: string;
  onClick: () => void;
  disabled: boolean;
}) => {
  return (
    <div
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
      className="mt-24px px-24px py-12px rounded-8px bg-backgroundPrimary body1 text-fontSecondary flex flex-row--between cursor-pointer hover:bg-overlayWeb2 hover:text-fontPrimary"
    >
      <span> {text}</span>
      <AddIcon width={20} height={20} className="hover:text-fontPrimary" />
    </div>
  );
};

export default NoTasks;
