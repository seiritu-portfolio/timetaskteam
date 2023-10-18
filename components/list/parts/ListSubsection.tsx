import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setCurrentListID } from '@store/modules/list';
import { currentListIDSelector } from '@store/selectors/list';
import { ListSideMenuDropPad } from '@component/home/sideMenu/ListMenuDropPad';

import ListRow from '../ListRow';
import DownTriangleIcon from '@svg/triangle-small.svg';
import ClosedTriangleIcon from '@svg/triangle-small-right.svg';
import TrayIcon from '@svg/tray.svg';
import { currentCodisplayUserSelector } from '@store/selectors/home';

const ListSubsection = ({
  title,
  renderList,
  inboxID,
  listType,
  keyPrefix,
}: {
  title: string;
  renderList: any[];
  inboxID: number | undefined;
  listType: string;
  keyPrefix: string;
}) => {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const currentListID = useSelector(currentListIDSelector);
  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);

  return (
    <>
      <div
        className={`mt-12px p-12px h-44px text-fontSecondary flex flex-row items-center cursor-pointer`}
        onClick={() => setOpen((old) => !old)}
      >
        {(() => {
          const Icon = open ? DownTriangleIcon : ClosedTriangleIcon;

          return <Icon width={20} height={20} className="" />;
        })()}
        <span className="ml-16px body1 truncate">{title}</span>
      </div>
      <div
        className={`relative overflow-hidden transition-all ease-in-out delay-400 ${
          open ? '' : 'hidden'
        }`}
      >
        {(() => {
          if (!renderList || renderList.length === 0) {
            return null;
          }
          const collectInboxes = renderList.reduce(
            (ctx: { [id: string]: any }, el: any) => {
              if (el.id === inboxID) {
                ctx.inbox.push(el);
              } else {
                ctx.general.push(el);
              }
              return ctx;
            },
            { inbox: [], general: [] },
          );

          return (
            <>
              {collectInboxes.inbox.length === 0
                ? null
                : collectInboxes.inbox.map((item: any) => {
                    const Icon = TrayIcon;
                    return (
                      <ListRow
                        data={item}
                        Icon={Icon}
                        onClick={() => {
                          dispatch(setCurrentListID(item.id));
                        }}
                        isActive={item.id === currentListID}
                        key={`list-type-${keyPrefix}-list-${item.id}`}
                      />
                    );
                  })}
              {collectInboxes.general.length > 0 && (
                <ListSideMenuDropPad
                  droppableId={`lists-modal-listmenu-${listType}-${currentCodisplayUserID}`}
                  listArray={collectInboxes.general}
                  currentListId={currentListID}
                  hideTasksNumber={true}
                />
              )}
            </>
          );
        })()}
      </div>
    </>
  );
};

export default ListSubsection;
