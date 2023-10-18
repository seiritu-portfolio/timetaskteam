import { useDispatch, useSelector } from 'react-redux';

import { replaceState } from '@util/replaceUrl';
import { activeSettingsTabSelector } from '@store/selectors/home';
import { setActiveSettingsTab } from '@store/modules/home';

import { SETTINGS_MENU_DATA } from '@util/menuList';
import { SETTINGS_URL } from '@util/urls';

const SettingsMenu = () => {
  const dispatch = useDispatch();
  const activeTabIndex = useSelector(activeSettingsTabSelector);

  return (
    <div className="px-12px w-1/4 border-r border-separator flex flex-col items-center">
      <div className="w-full">
        <div className="ml-12px h-72px body1 text-fontSecondary flex items-center">
          <span>設定</span>
        </div>
        <div className="w-full">
          {SETTINGS_MENU_DATA.map((item) => (
            <MenuItem
              key={`setting-menu-${item.index}`}
              text={item.text}
              Icon={item.Icon}
              link={item.link}
              active={item.index === activeTabIndex}
              onClick={() => {
                dispatch(setActiveSettingsTab(item.index));
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;

interface MenuItemProps {
  text: string;
  link: string;
  Icon: any;
  active: boolean;
  onClick: () => void;
}

const MenuItem = ({ text, link, Icon, active, onClick }: MenuItemProps) => {
  return (
    <div
      onClick={() => {
        replaceState(`${SETTINGS_URL}/${link}`);
        onClick();
      }}
      className={`p-12px h-44px rounded-6px ${
        active
          ? 'bg-primarySelected text-primary'
          : 'bg-backgroundSecondary text-black'
      } flex flex-row items-center hover:bg-primarySelected hover:text-primary cursor-pointer`}
    >
      {Icon ? <Icon width={20} height={20} /> : null}
      <h4 className="ml-16px body1">{text}</h4>
    </div>
  );
};
