export const SHORTCUT_LIST = [
  {
    key: ['alt+m', 'alt+M', 'alt+µ'],
    action: 'month',
  },
  {
    key: ['alt+x', 'alt+X', 'alt+≈'],
    action: 'weeks4',
  },
  {
    key: ['alt+f', 'alt+F', 'alt+ƒ'],
    action: 'weeks2',
  },
  {
    key: ['alt+w', 'alt+W', 'alt+∑'],
    action: 'week',
  },
  {
    key: ['alt+s', 'alt+S', 'alt+ß'],
    action: 'modal',
    subaction: 'settings',
  },
  {
    key: ['alt+c', 'alt+C', 'alt+ç'],
    action: 'screen',
    subaction: 'calendar',
  },
  {
    key: ['alt+t', 'alt+T', 'alt+†'],
    action: 'screen',
    subaction: 'task',
  },
  {
    key: ['alt+n', 'alt+N', 'alt+dead'],
    action: 'screen',
    subaction: 'note',
  },
  {
    key: ['shift+c', 'shift+C'],
    action: 'modal',
    subaction: 'newSchedule',
    disabledForInput: true,
  },
  {
    key: ['shift+t', 'shift+T'],
    action: 'modal',
    subaction: 'newTask',
    disabledForInput: true,
  },
  {
    key: ['shift+n', 'shift+N'],
    action: 'modal',
    subaction: 'newNote',
    disabledForInput: true,
  },
  {
    key: ['shift+M', 'shift+m'],
    action: 'switch',
    disabledForInput: true,
  },
  {
    key: [
      // 'left',
      'ctrl+Left',
      'ctrl+left',
      'shift+left',
      'shift+arrowleft',
      'arrowleft',
    ],
    action: 'switch',
    subaction: 'before',
    // disabledForInput: true,
  },
  {
    key: [
      // 'right',
      'ctrl+Right',
      'ctrl+right',
      'shift+right',
      'shift+arrowright',
      'arrowright',
    ],
    action: 'switch',
    subaction: 'after',
    // disabledForInput: true,
  },
  {
    key: ['shift+f', 'shift+F'],
    action: 'search',
    disabledForInput: true,
  },
];
