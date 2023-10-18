import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// * hooks
import { useWindowDimensions } from '@util/calendar';
import { isSidebarOpenSelector } from '@store/selectors/home';
// * components
import { SideUserSwitchBar } from '@component/calendar/SideCodisplayBar';
import HeadingMenu from '@component/home/HeadingMenu';
import ListSideMenu from '@component/note/sideMenu/List';
import NoteDetail from '@component/note/detail';

const NotesLayout = (props: any) => {
  const { width: windowWidth } = useWindowDimensions();
  const isSidebarOpen = useSelector(isSidebarOpenSelector);
  const [containerWidth, setContainerWidth] = useState<number>();
  useEffect(() => {
    const sidebarWidth = isSidebarOpen ? 300 : 92;
    let newWidth = 0;
    if (windowWidth) {
      newWidth = windowWidth - sidebarWidth;
    } else if (windowWidth) {
      newWidth = windowWidth - sidebarWidth - 62;
    }
    setContainerWidth(Math.max(0, newWidth));
  }, [windowWidth, isSidebarOpen]);

  return (
    <div className="w-full h-screen flex flex-row">
      <SideUserSwitchBar />
      <div
        className="flex-1 h-screen flex flex-col"
        style={{
          width: containerWidth,
        }}
      >
        <HeadingMenu />
        <div className="relative flex-1 flex flex-row overflow-y-auto overflow-x-hidden">
          <ListSideMenu />
          <div className="w-1/5 flex flex-col overflow-y-auto border-r border-separator">
            {props.children}
          </div>
          <div className={`flex-1 flex flex-col overflow-y-auto`}>
            <NoteDetail />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesLayout;
