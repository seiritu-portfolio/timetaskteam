import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  premiumCodeSelector,
  userCountSelector,
} from '@store/selectors/subscription';
import { useInvitedList } from '@service/subscriptionQueries';
import {
  setCurrentOpenModal,
  setCurrentSettingState,
} from '@store/modules/subscription';
import RightIcon from '@svg/chevron-right.svg';
import WrappedListIcon from '@svg/list-wrap.svg';
import LogoMedumIcon from '@svg/logo.medium.svg';

const Heading = ({
  onDisplayPremiumCode,
  onPurchaseMore,
  onManageUsers,
}: {
  onDisplayPremiumCode?: () => void;
  onPurchaseMore?: () => void;
  onManageUsers?: () => void;
}) => {
  const dispatch = useDispatch();
  const totalUsersCount = useSelector(userCountSelector);
  const invitedListResult = useInvitedList();
  const [showPremiumCode, setShowPremiumCode] = useState(false);
  const premiumCode = useSelector(premiumCodeSelector);

  const userCount = useMemo(() => {
    if (invitedListResult.isSuccess) {
      return invitedListResult.data.length;
    } else {
      return 0;
    }
  }, [invitedListResult.isSuccess, invitedListResult.data]);

  return (
    <div
      className={`p-24px ${
        totalUsersCount && totalUsersCount > 0
          ? 'border-b border-separator'
          : 'border-b-1/2 border-separator'
      }`}
    >
      <div className="relative p-24px rounded-8px bg-gradient--subscription text-backgroundSecondary">
        <div className="absolute right-0 -bottom-70px w-150px overflow-x-hidden">
          <LogoMedumIcon className="" />
        </div>
        <div className="big-title-light">
          チーム連携を柔軟にマネジメントする
          <br />
          プレミアムプラン
        </div>
        <div className="mt-12px body2 flex-row--between">
          <span>
            {!totalUsersCount || totalUsersCount === 0
              ? '1ユーザー / 月額 ¥1200'
              : `${totalUsersCount}ユーザー / 契約中`}
          </span>
          {totalUsersCount && totalUsersCount > 0 && (
            <span>月額 ¥{1200 * totalUsersCount}</span>
          )}
        </div>
      </div>
      {premiumCode !== '' && totalUsersCount && totalUsersCount > 0 ? (
        <div className="mt-24px body1 text-primary flex-row--between">
          <div className="">
            <span className="text-fontSecondary">
              {totalUsersCount > userCount
                ? `残り${totalUsersCount - userCount}ユーザーの登録が可能です`
                : ' プレミアムコードに空きはありません'}
            </span>
            {totalUsersCount > userCount ? (
              <span
                className="ml-24px cursor-pointer"
                onClick={() => {
                  setShowPremiumCode((old) => !old);
                }}
              >
                {showPremiumCode ? premiumCode : 'プレミアムコードを表示'}
              </span>
            ) : (
              <span
                onClick={() => {
                  dispatch(setCurrentOpenModal(4));
                }}
                className="ml-24px body1 text-primary cursor-pointer"
              >
                追加購入
              </span>
            )}
          </div>
          <div
            className="flex items-center cursor-pointer z-20"
            onClick={() => {
              dispatch(setCurrentSettingState(1));
            }}
          >
            <span>ユーザー管理</span>
            <RightIcon
              width={20}
              height={20}
              className="ml-4px text-fontSecondary"
            />
          </div>
        </div>
      ) : premiumCode !== '' ? null : (
        <>
          <div className="mt-24px big-title-light text-fontPrimary">
            今すぐ無制限のリストで管理しよう
          </div>
          <div className="mt-24px w-full flex flex-row">
            <WrappedListIcon width={44} height={44} className="flex-none" />
            <div className="ml-16px">
              <div className="body1 text-fontPrimary">
                上限数5つから無制限にアップグレード
              </div>
              <div className="mt-8px body1 text-fontSecondary">
                タスク・スケジュールのユーザー間共有は全てリスト単位で管理します。
                <br />
                無制限に追加可能なリストにより、プロジェクトごと・スケジュールごとにタスクを振り分け、より多くのチームメンバーと共有し管理しましょう。
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Heading;
