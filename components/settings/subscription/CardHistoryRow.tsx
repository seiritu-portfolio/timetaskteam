import { IconWrap } from '@component/general/wrap';
import CreditcardIcon from '@svg/creditcard.svg';
import ApplelogoIcon from '@svg/applelogo.svg';
import GooglelogoIcon from '@svg/googlelogo_wb.svg';

const CardHistoryRow = ({
  paymentMethod,
  billingDate,
  totalPrice,
  cardInfo,
}: {
  paymentMethod: string;
  billingDate: string;
  totalPrice: number;
  cardInfo: string;
}) => {
  return (
    <>
      <div className="py-12px px-24px w-full title-en text-fontPrimary flex-row--between ">
        <div className="flex items-center">
          <IconWrap additionalClass="bg-backgroundPrimary">
            {paymentMethod === 'stripe' ? (
              <CreditcardIcon width={20} height={20} />
            ) : paymentMethod === 'apple' ? (
              <ApplelogoIcon width={20} height={20} />
            ) : (
              <GooglelogoIcon width={20} height={20} />
            )}
          </IconWrap>
          <div className="ml-16px">
            {(cardInfo ? cardInfo.charAt(0).toUpperCase() : '') +
              (cardInfo ? cardInfo.slice(1) : '')}
          </div>
        </div>
        <div className="flex items-center">
          <div className="">{billingDate}</div>
          <div className="ml-24px">¥{totalPrice}</div>
        </div>
      </div>
      <div className="ml-80px h-1px bg-separator" />
    </>
  );
};

export default CardHistoryRow;
