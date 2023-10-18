import { useSelector } from 'react-redux';
import { currentTaskSelector } from '@store/selectors/tasks';
import { TASK_DETAIL_TAB_MENU_LIST } from '@util/menuList';

const TabModalTask = ({
  currentTab,
  setCurrentTab,
}: {
  currentTab: number;
  setCurrentTab: (newValue: number) => void;
}) => {
  const currentTask = useSelector(currentTaskSelector);

  return (
    <div className="flex">
      {TASK_DETAIL_TAB_MENU_LIST.map((menu) => (
        <div
          className={`py-12px px-16px body1 cursor-pointer 
          ${
            currentTab === menu.value
              ? 'bg-backgroundPrimary text-fontPrimary'
              : 'text-fontSecondary'
          }
          `}
          onClick={() => {
            if (menu.value != 1) {
              setCurrentTab(menu.value);
            } else if (menu.value == 1 && currentTask.continuation == 1) {
              setCurrentTab(menu.value);
            }
          }}
          key={`task-modal-tab-menu-${menu.value}`}
        >
          {menu.label}
        </div>
      ))}
    </div>
  );
};

export default TabModalTask;
