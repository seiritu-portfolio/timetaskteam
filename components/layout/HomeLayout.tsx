import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// * hooks
import {
  currentTaskIDSelector,
  showTaskDetailSelector,
} from '@store/selectors/tasks';
import {
  codisplayFetchingSelector,
  isSidebarOpenSelector,
  previewImageSelector,
} from '@store/selectors/home';
import { useTasksFillStartdate } from '@service/taskQueries';
import { useWindowDimensions } from '@util/calendar';
// * components
import SideUtilRateBar from '@component/home/SideUtilRateBar';
import HeadingMenu from '@component/home/HeadingMenu';
import TaskSideMenu from '@component/home/sideMenu/TaskSideMenu';
import TaskDetail from '@component/home/tasks/TaskDetail';

const HomeLayout = (props: any) => {
  const currentTaskID = useSelector(currentTaskIDSelector);
  const showDetail = useSelector(showTaskDetailSelector);

  const previewImageUrl = useSelector(previewImageSelector);
  const isFetching = useSelector(codisplayFetchingSelector);

  const { width: windowWidth } = useWindowDimensions();
  useTasksFillStartdate();
  const isSidebarOpen = useSelector(isSidebarOpenSelector);

  const [width, setWidth] = useState(0);
  useEffect(() => {
    const sidebarWidth = isSidebarOpen ? 300 : 92;
    const sidepanelWidth = !currentTaskID || !showDetail ? 0 : 432;
    const containerWidth = (windowWidth ?? 0) - sidebarWidth;
    const tempWidth = Math.floor((containerWidth * 3) / 4 - sidepanelWidth);

    setWidth(Math.max(0, tempWidth));
  }, [isSidebarOpen, windowWidth, currentTaskID, showDetail]);

  return (
    <div
      className={`w-full h-screen flex flex-row ${
        previewImageUrl != '' ? 'blur-sm' : ''
      }`}
    >
      <SideUtilRateBar />
      <div
        className={`relative flex-1 h-screen flex flex-col z-80`}
        style={{
          width: Math.max((windowWidth ?? 0) - (isSidebarOpen ? 300 : 92), 0),
        }}
      >
        <div
          className={`absolute lds-dual-ring-general z-50 ${
            isFetching ? '' : 'invisible'
          }`}
        />
        <HeadingMenu />
        <div className="relative flex-1 flex flex-row overflow-y-auto overflow-x-hidden">
          <div className="w-1/4 flex flex-col overflow-y-auto">
            <TaskSideMenu />
          </div>
          <div
            className="flex-1 flex flex-col"
            style={{
              width: `${width}px`,
            }}
          >
            {props.children}
          </div>
          <div
            className={`${
              !currentTaskID || !showDetail ? 'hidden' : ''
            } flex-none w-432px h-full border-l-1/2 border-separator overflow-y-auto`}
          >
            <TaskDetail />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
