import { useState } from 'react';
import AvatarImage, { AvatarSelectable2 } from '@component/general/avatar';
import RequestHandler from './tasks/requestTask/RequestHandler';

import { DEFAULT_AVATAR_URL } from '@util/urls';

const TaskRequestRow = ({
  id,
  type,
  name,
  avatar,
  color,
  hasChild,
  showMenu,
  rerequestable,
  selected,
  menuType,
  onSelect,
  onRequestCancel,
  onRequestUpdate,
  onRequestAdd,
  onRequestAllCancel,
}: {
  id: number;
  type: number;
  name?: string;
  avatar: string;
  color: string;
  hasChild?: boolean;
  showMenu: boolean;
  rerequestable?: boolean;
  selected?: boolean;
  menuType?: number;
  onSelect?: () => void;
  onRequestCancel?: (newCoopId: number) => void;
  onRequestUpdate?: (oldCoopId: number, newCoopId: number) => void;
  onRequestAdd?: (newCoopId: number, role: 2 | 3 | 4) => void;
  onRequestAllCancel?: () => void;
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className="py-12px flex-row--between cursor-default"
      onClick={() => {
        setFocused(true);
      }}
      onBlur={() => {
        setFocused(false);
      }}
      tabIndex={type}
    >
      <div className="flex items-center">
        {selected == undefined ? (
          <AvatarImage
            imgSrc={avatar != '' ? avatar : DEFAULT_AVATAR_URL}
            styleClass=""
            color={color}
          />
        ) : (
          <AvatarSelectable2
            imgSrc={avatar != '' ? avatar : DEFAULT_AVATAR_URL}
            styleClass=""
            selected={selected}
            color={color}
            onClick={() => {
              if (onSelect) onSelect();
            }}
          />
        )}
        <div className="ml-16px">
          <div className="text-fontSecondary body2">
            {type === 1
              ? '依頼主'
              : type === 2 && hasChild
              ? '再依頼主'
              : '依頼先'}
          </div>
          <div className="text-fontPrimary body1">{name ?? ''}</div>
        </div>
      </div>
      {showMenu && menuType && menuType > 0 ? (
        <RequestHandler
          className={focused ? '' : 'invisible'}
          type={menuType}
          // type={hasChild ? 1 : rerequestable ? 2 : 3}
          onClear={onRequestAllCancel ? onRequestAllCancel : () => {}}
          onChange={() => {
            // modal show to select replace user
          }}
          onAdd={() => {
            // modal show to select add user
          }}
          onCancel={() => {
            if (onRequestCancel) {
              onRequestCancel(id);
            }
          }}
          avatar={avatar}
        />
      ) : null}
    </div>
  );
};

export default TaskRequestRow;
