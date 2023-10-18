import { useSelector } from 'react-redux';

import { previewImageSelector } from '@store/selectors/home';

import HeadingMenu from '@component/home/HeadingMenu';
import SideCodisplayBar from '@component/calendar/SideCodisplayBar';

const CalendarLayout = (props: any) => {
  const previewImageUrl = useSelector(previewImageSelector);

  return (
    <div
      className={`w-full overflow-hidden h-screen flex flex-row ${
        previewImageUrl != '' ? 'blur-sm' : ''
      }`}
    >
      <SideCodisplayBar />
      <div className="flex-1 h-screen flex flex-col">
        <HeadingMenu />
        <div id="calendar-scroll-body" className={`flex-1 flex flex-col`}>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default CalendarLayout;
