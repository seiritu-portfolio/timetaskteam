import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// * hooks
import { setViewMode } from '@store/modules/calendar';
import { viewModeSelector } from '@store/selectors/calendar';
// * viewMode
import { ViewModeSelect } from '@component/home/Selects';

interface ViewModeProps {
  className?: string;
}

const ViewMode = (props: ViewModeProps) => {
  const { className = '' } = props;
  const dispatch = useDispatch();
  const viewMode = useSelector(viewModeSelector);
  const setTab = useCallback(
    (
      newMode: 'month' | 'weeks4' | 'weeks2' | 'half' | 'week',
      oldMode: 'month' | 'weeks4' | 'weeks2' | 'half' | 'week',
    ) => {
      if (newMode !== oldMode) {
        dispatch(setViewMode(newMode));
      }
    },
    [dispatch],
  );

  return (
    <div className={className}>
      <ViewModeSelect
        value={viewMode}
        onChange={(newValue: 'month' | 'weeks4' | 'weeks2' | 'half' | 'week') =>
          setTab(newValue, viewMode)
        }
      />
    </div>
  );
};

export default ViewMode;
