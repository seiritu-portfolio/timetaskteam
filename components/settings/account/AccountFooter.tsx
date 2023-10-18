import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { resetUser } from '@store/modules/user';

const AccountFooter = ({
  deleteAccount,
  showSave,
  disabledSaveBtn,
  cancel,
  save,
}: {
  deleteAccount: () => void;
  showSave: boolean;
  disabledSaveBtn: boolean;
  cancel: () => void;
  save?: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div
      className={`flex-none h-68px flex ${
        showSave ? 'px-24px py-12px justify-end' : 'p-24px flex-col'
      } transition-all duration-500`}
    >
      {showSave ? (
        <>
          <span
            className="p-12px body3 text-fontSecondary cursor-pointer"
            onClick={cancel}
          >
            キャンセル
          </span>
          <button
            className={`p-12px body3 text-primary cursor-pointer ${
              disabledSaveBtn ? 'text-primaryDisabled' : 'text-primary'
            }`}
            disabled={disabledSaveBtn}
          >
            保存
          </button>
        </>
      ) : (
        <span
          className="body2 text-fontPrimary cursor-pointer"
          onClick={() => {
            setExpanded((old) => !old);
          }}
        >
          アクション
        </span>
      )}
      {expanded && !showSave && (
        <>
          <div
            className="mt-24px body1 text-fontSecondary cursor-pointer"
            onClick={() => {
              localStorage.setItem('task3_token', JSON.stringify(null));
              dispatch(resetUser);
              router.reload();
            }}
          >
            サインアウト
          </div>
          <div
            className="mt-24px body1 text-secondary cursor-pointer"
            onClick={deleteAccount}
          >
            アカウント削除
          </div>
          <div className="mt-12px pb-24px w-412px body2 text-fontSecondary cursor-pointer">
            これを行うと、スケジュール、タスクなど、すべてのデータが直ちに削除されます。これを元に戻すことはできません
          </div>
        </>
      )}
    </div>
  );
};

export default AccountFooter;
