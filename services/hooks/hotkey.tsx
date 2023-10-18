import { useCallback, useMemo } from 'react';
import HotKeys from 'react-hot-keys';
// * hooks
import useHotkeys from './useHotkeys';
// * constants
import { SHORTCUT_LIST } from '@util/shortcutMap';

const HotKeysController = () => {
  const onKeyHandler = useHotkeys();

  const keyNames = useMemo(() => {
    let newList: string[] = [];
    SHORTCUT_LIST.forEach((item) => {
      newList = [...newList, ...item.key];
    });
    return newList.join(',');
  }, []);
  const onKeyDown = useCallback(
    (keyName, e, handle) => {
      const filtered = SHORTCUT_LIST.filter((item) =>
        item.key.includes(keyName),
      );
      if (filtered.length > 0) {
        const currentAction = filtered[0].action;
        const currentSubaction = filtered[0].subaction;
        onKeyHandler(currentAction, currentSubaction);
      }
    },
    [onKeyHandler],
  );

  return <HotKeys keyName={keyNames} onKeyDown={onKeyDown} />;
};

export default HotKeysController;
