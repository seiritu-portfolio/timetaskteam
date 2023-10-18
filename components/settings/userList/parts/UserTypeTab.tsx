import { COOPERATE_TABS_LIST } from '@util/menuList';

interface UserTypeTabProp {
  active: number;
  setActive: any;
  onAdd: any;
}

const UserTypeTab = ({ active, setActive, onAdd }: UserTypeTabProp) => {
  return (
    <div className="mb-12px mx-24px px-16px h-44px rounded-6px bg-backgroundPrimary flex flex-row justify-between items-center">
      <div className="flex flex-row body1 text-fontSecondary">
        {COOPERATE_TABS_LIST.map((_, index) => (
          <span
            className={`${
              index === active ? 'text-fontPrimary' : 'text-fontSecondary'
            } mr-16px cursor-pointer`}
            key={`userlist-type-tab-${index}`}
            onClick={() => setActive(index)}
          >
            {_.desc}
          </span>
        ))}
      </div>
      <span className="body1 text-primary cursor-pointer" onClick={onAdd}>
        {COOPERATE_TABS_LIST[active].descForAdd}
      </span>
    </div>
  );
};

export default UserTypeTab;
