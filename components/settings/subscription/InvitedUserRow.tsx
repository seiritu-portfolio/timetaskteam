import AvatarImage from '@component/general/avatar';
import { COLOR_VALUES } from '@util/constants';

const InvitedUserRow = ({
  name,
  avatar,
  color,
  onDelete,
}: {
  name: string;
  avatar: string;
  color: number;
  onDelete: () => void;
}) => {
  return (
    <div className="py-12px flex-row--between">
      <div className="flex items-center">
        <AvatarImage
          styleClass=""
          imgSrc={avatar}
          color={color ? COLOR_VALUES[color].label : 'pink'}
        />
        <div className="ml-16px body1 text-fontPrimary">{name}</div>
      </div>
      <div className="body1 text-secondary cursor-pointer" onClick={onDelete}>
        解約
      </div>
    </div>
  );
};

export default InvitedUserRow;
