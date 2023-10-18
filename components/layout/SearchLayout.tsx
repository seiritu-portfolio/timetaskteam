import { useSelector } from 'react-redux';

import { previewImageSelector } from '@store/selectors/home';
import SideUtilRateBar from '@component/home/SideUtilRateBar';
import HeadingMenu from '@component/home/HeadingMenu';

const SearchLayout = (props: any) => {
  const previewImageUrl = useSelector(previewImageSelector);

  return (
    <div
      className={`w-full h-screen flex flex-row ${
        previewImageUrl != '' ? 'blur-sm' : ''
      }`}
    >
      <SideUtilRateBar />
      <div className="flex-1 h-screen flex flex-col">
        <HeadingMenu />
        <div className="flex-1 flex flex-row overflow-y-auto">
          {props.children}
          {/* <div className="w-3/5 flex flex-col"></div>
          <div className="flex-1 flex flex-col"></div> */}
        </div>
      </div>
    </div>
  );
};

export default SearchLayout;
