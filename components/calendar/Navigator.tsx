import { useDispatch } from 'react-redux';
// * hooks
import { next, prev } from '@store/modules/calendar';
// * resources
import ArrowLeftIcon from '@svg/arrow-left.svg';
import ArrowRightIcon from '@svg/arrow-right.svg';
interface NavigatorProps {
  className?: string;
}

const Navigator = (props: NavigatorProps) => {
  const { className = '' } = props;
  const dispatch = useDispatch();

  return (
    <div className={`flex items-center ${className}`}>
      <div className={'p-2px w-65px body1 select-none cursor-pointer'}>
        <div className={'h-32px relative flex items-center'}>
          <div className={'rounded-full hover:bg-separator active:shadow'}>
            <div
              className={
                'flex items-center justify-center h-32px w-32px tooltip'
              }
              onClick={() => dispatch(prev())}
            >
              <ArrowLeftIcon width={14} height={14} />
              <span className="absolute top-full mt-1 px-2 py-1 w-12 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext">
                前月
              </span>
            </div>
          </div>
          <div className={'rounded-full hover:bg-separator active:shadow'}>
            <div
              className={
                'flex items-center justify-center h-32px w-32px tooltip'
              }
              onClick={() => {
                dispatch(next());
              }}
            >
              <ArrowRightIcon width={14} height={14} />
              <span className="absolute top-full mt-1 px-2 py-1 w-12 rounded-2px bg-fontSecondary body3 text-backgroundSecondary text-center z-50 tooltiptext">
                翌月
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigator;
