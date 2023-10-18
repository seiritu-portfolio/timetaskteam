import { usePremiumOwner } from '@service/subscriptionQueries';
import AvatarImage from '@component/general/avatar';
import SettingsHeader from '../SettingsHeader';
import Heading from './Heading';
import { COLOR_VALUES } from '@util/constants';

const PremiumInvited = () => {
  const premiumOwner = usePremiumOwner();

  return (
    <div className="relative h-full flex flex-col">
      <SettingsHeader title="サブスクリプション" />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Heading />
        <div className="p-24px">
          <div className="body1 text-fontPrimary">
            プレミアムサービスをご利用いただきありがとうございます。
          </div>
          {premiumOwner.isSuccess && premiumOwner.data.length > 0 && (
            <div className="mt-36px body1 text-primary flex items-center">
              <span>プレミアムコードの所有者</span>
              <div className="ml-72px flex items-center">
                <AvatarImage
                  styleClass=""
                  imgSrc={premiumOwner.data[0].avatar}
                  color={
                    COLOR_VALUES[premiumOwner.data[0]?.pivot.color ?? 0].label
                  }
                />
                <div className="ml-16px text-fontPrimary">
                  <div className="">{premiumOwner.data[0].name}</div>
                  <div className="">{premiumOwner.data[0].uuid} </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumInvited;
