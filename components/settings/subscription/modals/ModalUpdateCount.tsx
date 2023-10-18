import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import Modal from 'react-responsive-modal';
import { toast } from 'react-toastify';

import {
  cardLast4Selector,
  userCountSelector,
} from '@store/selectors/subscription';
import {
  useInvitedList,
  usePaymentHistory,
} from '@service/subscriptionQueries';

import UserCountSelect from '../UserCountSelect';
import {
  configBearerToken,
  SUBSCRIPTION_USERCOUNT_MESSAGES,
} from '@util/constants';
import {
  URL_DELETE_SUBSCRIPTION,
  URL_UPDATE_PAYMENT_QUANTITY,
} from '@util/urls';
import axiosConfig from '@util/axiosConfig';

const ModalUpdateCount = ({
  isOpen,
  close,
}: {
  isOpen: boolean;
  close: () => void;
}) => {
  const totalUserCount = useSelector(userCountSelector);
  const invitedListResult = useInvitedList();
  // current users count (including me)
  const currentUserCount = useMemo(() => {
    if (invitedListResult.status === 'success') {
      return invitedListResult.data.length;
    } else {
      return -1;
    }
  }, [invitedListResult.status, invitedListResult.data]);
  const cardLast4 = useSelector(cardLast4Selector);
  const queryClient = useQueryClient();

  const mutation = useMutation(
    ({ quantity }: { quantity: number }) => {
      const token = localStorage.getItem('task3_token');
      const config = configBearerToken(token ?? '');

      return axiosConfig.put(
        URL_UPDATE_PAYMENT_QUANTITY,
        {
          quantity,
        },
        { ...config },
      );
    },
    {
      onSuccess: async () => {
        toast.success('成功', {
          hideProgressBar: false,
          progress: undefined,
          onOpen: () => {
            queryClient.invalidateQueries('my_info');
            queryClient.invalidateQueries('premium_owner');
            close();
          },
        });
      },
      onError: async () => {
        toast.error('失敗', {
          hideProgressBar: false,
          progress: undefined,
        });
      },
    },
  );

  const subscriptionRemoveMutation = useMutation(
    () => {
      const token = localStorage.getItem('task3_token');
      const config = configBearerToken(token ?? '');

      return axiosConfig.delete(URL_DELETE_SUBSCRIPTION, { ...config });
    },
    {
      onSuccess: async () => {
        toast.success('成功', {
          hideProgressBar: false,
          progress: undefined,
          onOpen: () => {
            queryClient.invalidateQueries('my_info');
            queryClient.invalidateQueries('premium_owner');
            setIsConfirmModal(false);
            close();
          },
        });
      },
      onError: async () => {
        toast.error('失敗', {
          hideProgressBar: false,
          progress: undefined,
        });
      },
    },
  );

  const [userCount, setUserCount] = useState(totalUserCount ?? 0);
  const [isConfirmModal, setIsConfirmModal] = useState(false);

  const [payDate, setPayDate] = useState('');
  const history = usePaymentHistory();
  useEffect(() => {
    if (history.isSuccess) {
      let lastPayDate, newPayDate;
      if (history.data.length > 0) {
        lastPayDate = new Date(history.data[0].created_at);
        newPayDate = new Date(lastPayDate.setMonth(lastPayDate.getMonth() + 1));
      } else {
        newPayDate = new Date();
      }

      setPayDate(
        newPayDate.getFullYear() +
          '年' +
          (newPayDate.getMonth() + 1) +
          '月' +
          (newPayDate.getDate() + '日'),
      );
    }
  }, [history.isSuccess, history.data]);

  return (
    <>
      <Modal
        open={isOpen}
        onClose={close}
        center
        showCloseIcon={false}
        classNames={{
          modal: 'modal-md-size',
        }}
      >
        <div className="p-36px">
          <div className="big-title-light text-fontPrimary">
            プレミアムプラン
          </div>
          <UserCountSelect
            userCount={totalUserCount ?? 1}
            setUserCount={setUserCount}
          />
          {totalUserCount &&
            totalUserCount === userCount &&
            currentUserCount >= 0 && (
              <div className="mt-24px body2 text-fontSecondary">
                <div
                  className={`${
                    totalUserCount > currentUserCount
                      ? 'text-primary'
                      : 'text-secondary'
                  }`}
                >
                  {(totalUserCount > currentUserCount
                    ? SUBSCRIPTION_USERCOUNT_MESSAGES.SPACES_LEFT
                    : SUBSCRIPTION_USERCOUNT_MESSAGES.NO_SPACE_LEFT
                  ).replace(
                    /\%s/g,
                    (totalUserCount - currentUserCount).toString(),
                  )}
                </div>
                <div>
                  {totalUserCount > currentUserCount
                    ? 'コードをチームメンバーに付与することで、プレミアムプランへのアップグレードが可能になります。'
                    : 'プレミアムユーザーを追加したい場合は既存の契約数を追加して下さい。契約数を減らす場合は、ユーザー管理画面より事前に解約処理をしてください。'}
                </div>
              </div>
            )}
          {totalUserCount &&
            totalUserCount !== userCount &&
            currentUserCount >= 0 && (
              <div className="mt-24px body2 text-fontSecondary">
                <div
                  className={`${
                    userCount > totalUserCount
                      ? 'text-primary'
                      : 'text-secondary'
                  }`}
                >
                  {(userCount > currentUserCount
                    ? SUBSCRIPTION_USERCOUNT_MESSAGES.TO_REMOVE
                    : SUBSCRIPTION_USERCOUNT_MESSAGES.TO_ADD
                  ).replace(/\%s/g, (userCount - totalUserCount).toString())}
                </div>
                <div className="mt-4px">
                  {userCount > totalUserCount ? (
                    <>
                      {`次回のお支払い時
                        ${payDate === '' ? '' : '(' + payDate + ')'}
                        に${
                          userCount - totalUserCount
                        }名分/¥600が加算され、総額¥${
                        userCount * 300
                      }が請求されます。`}
                      <br />
                      {`請求日より以前に解約した場合、解約日に${
                        userCount - totalUserCount
                      }名分が請求されます。`}
                    </>
                  ) : (
                    `プレミアムコードから${
                      totalUserCount - userCount
                    }ユーザー分の枠が削除されます。次回のお支払い時(xxxx年xx月xx日)に2名分/¥${
                      300 * (totalUserCount - userCount)
                    }が減額され、総額¥${300 * userCount}が請求されます。`
                  )}
                </div>
              </div>
            )}
          <div className="mt-24px px-16px py-12px w-full rounded-8px bg-backgroundPrimary title-en text-fontPrimary flex items-center">
            <div className="flex-1">
              --------{cardLast4?.substr(cardLast4.length - 4) ?? '----'}
            </div>
            <div className="flex-none">--/--</div>
            <div className="ml-24px flex-none">---</div>
          </div>
          <div className="mt-36px w-full flex-row--between">
            <div
              className="text-secondary body1 cursor-pointer"
              onClick={() => {
                setIsConfirmModal(true);
              }}
            >
              全て解約
            </div>
            <div className="body1 text-fontSecondary cursor-pointer flex items-center">
              <span onClick={close}>キャンセル</span>
              <button
                disabled={totalUserCount === userCount || userCount === 0}
                className="ml-24px py-12px px-24px rounded-8px bg-primary text-backgroundSecondary body1 disabled:opacity-20"
                onClick={() => {
                  mutation.mutate({ quantity: userCount });
                }}
              >
                追加購入
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={isConfirmModal}
        onClose={() => setIsConfirmModal(false)}
        center
        showCloseIcon={false}
        classNames={{ modal: 'modal-md-size' }}
      >
        <div className="p-36px">
          <div className="big-title-light text-fontPrimary">
            削除してもよろしいですか
          </div>
          <div className="mt-24px flex justify-end items-center">
            <span
              onClick={() => {
                setIsConfirmModal(false);
              }}
              className="p-12px body1 text-fontSecondary cursor-pointer"
            >
              キャンセル
            </span>
            <button
              onClick={() => {
                subscriptionRemoveMutation.mutate();
              }}
              className="ml-12px px-24px h-44px rounded-8px bg-secondary button text-backgroundSecondary"
            >
              解約
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdateCount;
