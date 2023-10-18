import { useDispatch, useSelector } from 'react-redux';

import {
  cardLast4Selector,
  paymentMethodSelector,
} from '@store/selectors/subscription';
import {
  setCurrentOpenModal,
  setCurrentSettingState,
} from '@store/modules/subscription';
import { usePaymentHistory } from '@service/subscriptionQueries';

import { IconWrap } from '@component/general/wrap';
import SettingsHeader from '../SettingsHeader';
import Heading from './Heading';
import CardHistoryRow from './CardHistoryRow';
import CreditcardIcon from '@svg/creditcard.svg';
import ApplelogoIcon from '@svg/applelogo.svg';
import GooglelogoIcon from '@svg/googlelogo_wb.svg';
import RightIcon from '@svg/chevron-right.svg';

const PremiumPurchased = () => {
  const paymentMethod = useSelector(paymentMethodSelector);
  const cardLast4 = useSelector(cardLast4Selector);
  const history = usePaymentHistory();
  const dispatch = useDispatch();

  return (
    <div className="h-full flex flex-col">
      <SettingsHeader title="サブスクリプション" />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Heading />
        <div className="flex-1 p-24px w-full border-b border-separator">
          <div className="body2 text-fontSecondary">お支払い情報</div>
          <div className="mt-24px w-full flex-row--between">
            <div className="flex-row--between text-fontPrimary">
              <IconWrap additionalClass="bg-backgroundPrimary">
                {paymentMethod === 'stripe' ? (
                  <CreditcardIcon width={20} height={20} />
                ) : paymentMethod === 'apple' ? (
                  <ApplelogoIcon width={20} height={20} />
                ) : (
                  <GooglelogoIcon width={20} height={20} />
                )}
              </IconWrap>
              <span className="ml-16px title-en">
                {(cardLast4 ? cardLast4.charAt(0).toUpperCase() : '') +
                  (cardLast4 ? cardLast4.slice(1) : '')}
              </span>
            </div>
            <div
              className="body1 text-primary cursor-pointer"
              onClick={() => {
                dispatch(setCurrentOpenModal(3));
              }}
            >
              {paymentMethod === 'stripe' ? 'クレジットカード変更' : '変更'}
            </div>
          </div>
        </div>
        <div className="py-24px w-full">
          <div className="px-24px body2 text-fontSecondary">お支払い履歴</div>
          {history.isSuccess && history.data.length > 0 && (
            <div className="mt-24px w-full">
              {history.data.map((item: any) => {
                const payDate = new Date(item.created_at);
                const formattedDate =
                  payDate.getFullYear() +
                  '/' +
                  (payDate.getMonth() + 1) +
                  '/' +
                  payDate.getDate();
                return (
                  <CardHistoryRow
                    key={`payment-history-${item.id}`}
                    paymentMethod={
                      item.method === 1
                        ? 'stripe'
                        : item.method === 2
                        ? 'google'
                        : 'apple'
                    }
                    billingDate={formattedDate}
                    totalPrice={item.amount}
                    cardInfo={item.last4}
                  />
                );
              })}
            </div>
          )}
          <div className="mt-12px px-24px flex items-center justify-end">
            <div
              className="body1 text-primary cursor-pointer"
              onClick={() => {
                dispatch(setCurrentSettingState(2));
              }}
            >
              全て見る
            </div>
            <RightIcon width={20} height={20} className="text-fontSecondary" />
          </div>
        </div>
        <div className="flex-none p-24px border-t border-separator w-full flex-row--end">
          <div className="px-24px h-44px rounded-8px bg-backgroundPrimary body1 text-fontSecondary flex-xy-center cursor-pointer">
            <span>解約</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPurchased;
