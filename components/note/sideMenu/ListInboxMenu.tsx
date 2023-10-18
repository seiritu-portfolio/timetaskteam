import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
// * hooks
import { userInfoSelector } from '@store/selectors/user';
import { currentCodisplayUserSelector } from '@store/selectors/home';
// * assets
import InboxIcon from '@svg/tray.svg';
import { CLASSNAME_FOR_TASKMENU } from '@util/constants';

const ListInboxMenu = ({ folded }: { folded?: boolean }) => {
  const userInfo = useSelector(userInfoSelector);
  const currentCodisplayUserID = useSelector(currentCodisplayUserSelector);

  const router = useRouter();

  if (currentCodisplayUserID === userInfo.user?.id)
    return (
      <div
        className={`${CLASSNAME_FOR_TASKMENU} ${
          userInfo.user?.note_inbox_id ===
          parseInt(router.query.id?.toString() ?? '0')
            ? 'bg-primarySelected text-primary'
            : 'bg-backgroundSecondary text-fontPrimary'
        }`}
        onClick={() => {
          router.push(`/notes/list/${userInfo.user?.note_inbox_id ?? -1}`);
        }}
      >
        {folded ? (
          <InboxIcon width={20} height={20} />
        ) : (
          <div className="body1 flex items-center">
            <InboxIcon width={20} height={20} />
            <span className="ml-16px">インボックス</span>
          </div>
        )}
        <div className="flex-1 mb-72px"></div>
      </div>
    );
  else return null;
};

export default ListInboxMenu;
