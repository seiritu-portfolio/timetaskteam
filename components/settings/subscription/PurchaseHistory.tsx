import { usePaymentHistory } from '@service/subscriptionQueries';
import { setCurrentSettingState } from '@store/modules/subscription';
import { useDispatch } from 'react-redux';
import SettingsHeader from '../SettingsHeader';
import CardHistoryRow from './CardHistoryRow';

const PurchaseHistory = () => {
  const dispatch = useDispatch();
  const history = usePaymentHistory();

  return (
    <div className="h-full flex flex-col">
      <SettingsHeader
        title="お支払い履歴"
        onBack={() => {
          dispatch(setCurrentSettingState(0));
        }}
      />
      <div className="flex-1 py-12px flex flex-col overflow-y-auto">
        {history.isSuccess &&
          history.data.length > 0 &&
          history.data.map((item: any) => {
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
    </div>
  );
};

export default PurchaseHistory;
