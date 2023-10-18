import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { memberRatesSelector } from '@store/selectors/collabos';
import AvatarImage from '@component/general/avatar';
import { getHourMinFormat } from '@util/calendar';

const UserUtilizationRow = ({
  id,
  src,
  name,
  color,
  hiddenMode,
}: {
  id: number;
  src: string;
  name: string;
  color: string;
  hiddenMode?: boolean;
}) => {
  const workRatemembers = useSelector(memberRatesSelector);
  const workrate: null | {
    id: string;
    rate: number;
    actualTime: number;
    requiredTime: number;
  } = useMemo(() => {
    if (!workRatemembers || workRatemembers.length === 0) {
      return null;
    } else {
      const filtered = workRatemembers.filter((_) => parseInt(_.id) == id);
      return filtered.length === 0 ? null : filtered[0];
    }
  }, [workRatemembers, id]);

  return (
    <div className="relative flex-none mb-24px w-full h-68px rounded-8px bg-backgroundSecondary flex flex-col overflow-hidden">
      <div className="px-16px flex-1 flex flex-row items-center">
        <AvatarImage styleClass="flex-none" imgSrc={src} color={color} />
        <div className="ml-16px w-full h-full flex flex-col justify-center">
          <div className="">{name}</div>
          <div className="flex flex-row justify-between">
            <div
              className={`subtitle-en text-${
                workrate && workrate.rate > 1 ? 'secondary' : 'primary'
              }`}
            >
              {hiddenMode
                ? '-m/-m'
                : workrate
                ? `${getHourMinFormat(
                    workrate?.actualTime ?? 0,
                  )}/${getHourMinFormat(workrate.requiredTime)}`
                : '0m/0m'}
            </div>
            <div className="body1 text-fontSecondary">{`${
              hiddenMode
                ? '-'
                : workrate
                ? Math.round(workrate.rate * 100)
                : '0'
            }%`}</div>
          </div>
        </div>
      </div>
      <div className="flex-none h-3px rounded-2px bg-separator">
        <div
          className={`h-3px rounded-2px bg-${
            workrate && workrate.rate > 1 ? 'secondary' : 'primary'
          }`}
          style={{
            width: `${
              hiddenMode || workrate == null
                ? 0
                : Math.round(workrate.rate * 100)
            }%`,
          }}
        />
      </div>
    </div>
  );
};

export default UserUtilizationRow;
