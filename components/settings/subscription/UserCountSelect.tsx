import { useState } from 'react';

import DefaultSelect from '@component/general/select';
import LogoSmallIcon from '@svg/logo.small.svg';
import { SUBSCRIPTION_USERS_COUNT_LIST } from '@util/selectOptions';

const UserCountSelect = ({
  userCount,
  setUserCount,
}: {
  userCount: number;
  setUserCount: any;
}) => {
  const [newCount, setNewCount] = useState(userCount);

  return (
    <>
      <div className="mt-36px body2 text-fontSecondary">契約ユーザー数</div>
      <div className="mt-24px flex-row--between">
        <div className="flex flex-row items-center">
          <div className="h-44px w-44px rounded-8px bg-gradient--subscription-icon flex-xy-center">
            <LogoSmallIcon className="" />
          </div>
          <div className="ml-16px text-primary flex items-center">
            <span className="body3">月額</span>
            <span className="ml-4px body3-en">
              ¥{1200 * (newCount < 2 ? 1 : newCount)}
            </span>
          </div>
        </div>
        <div className="h-44px w-75px flex-none">
          <DefaultSelect
            value={
              SUBSCRIPTION_USERS_COUNT_LIST.includes(userCount)
                ? {
                    label: userCount.toString(),
                    value: userCount.toString(),
                  }
                : {
                    label: '1',
                    value: '1',
                  }
            }
            options={SUBSCRIPTION_USERS_COUNT_LIST.map((_) => {
              const value = _.toString();
              return {
                label: value,
                value,
              };
            })}
            onChange={(item: any) => {
              const newValue = parseInt(item.value);
              setNewCount(newValue);
              setUserCount(newValue);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default UserCountSelect;
