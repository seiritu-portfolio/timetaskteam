// * assets
import AvatarImage, { AvatarImageSelectable } from '@component/general/avatar';
import { DEFAULT_AVATAR_URL } from '@util/urls';

const CodisplayRow = ({
  id,
  src,
  name,
  color,
  selected,
  onClick,
}: {
  id: number;
  src: string;
  name: string;
  color: string;
  selected: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      className={`relative flex-none mb-24px w-full h-68px rounded-8px bg-${color} flex flex-col overflow-hidden bg-opacity-8 cursor-pointer`}
      onClick={onClick}
    >
      <div className="px-16px flex-1 flex flex-row items-center">
        <AvatarImageSelectable
          selected={selected}
          styleClass="mr-16px"
          imgSrc={src !== '' ? src : DEFAULT_AVATAR_URL}
          color={color}
          key={`calendar-codisplay-user-${id}`}
          onClick={() => {}}
        />
        <span className="caption2-en-light text-fontPrimary truncate">
          {name}
        </span>
      </div>
    </div>
  );
};

export default CodisplayRow;

const CodisplayRowNoSelect = ({
  id,
  src,
  name,
  color,
}: {
  id: number;
  src: string;
  name: string;
  color: string;
}) => (
  <div
    className={`relative flex-none mb-24px w-full h-68px rounded-8px bg-${color} flex flex-col overflow-hidden bg-opacity-8`}
  >
    <div className="px-16px flex-1 flex flex-row items-center">
      <AvatarImage
        styleClass="mr-16px"
        imgSrc={src !== '' ? src : DEFAULT_AVATAR_URL}
        color={color}
        key={`calendar-codisplay-user-${id}`}
      />
      <span className="caption2-en-light text-fontPrimary truncate">
        {name}
      </span>
    </div>
  </div>
);

export { CodisplayRowNoSelect };
