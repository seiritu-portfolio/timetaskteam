import { useDispatch } from 'react-redux';

import { setCurrentOpenModal } from '@store/modules/subscription';
import SettingsHeader from '../SettingsHeader';
import Heading from './Heading';

const InitialSetting = () => {
  const dispatch = useDispatch();

  return (
    <div className="h-full flex flex-col">
      <SettingsHeader title="サブスクリプション" />
      <div className="w-full flex-1 flex flex-col justify-between">
        <Heading />
        <div className="px-24px h-68px flex-row--between">
          <div
            className="body1 text-primary cursor-pointer"
            onClick={() => {
              dispatch(setCurrentOpenModal(1));
            }}
          >
            コード入力
          </div>
          <div
            className="body1 text-primary cursor-pointer"
            onClick={() => {
              dispatch(setCurrentOpenModal(0));
            }}
          >
            プレミアムプランへアップグレード
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialSetting;
