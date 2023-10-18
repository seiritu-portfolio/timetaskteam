import SettingsMenu from '@component/settings/SettingsMenu';

const SettingsLayout = (props: any) => {
  return (
    <div className="flex-1 flex">
      <SettingsMenu />
      <div className="w-3/4 h-full">{props.children}</div>
    </div>
  );
};

export default SettingsLayout;
