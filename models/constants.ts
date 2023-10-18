export interface TaskMenuType {
  text: string;
  icon: any;
  link: string;
  slug: string;
}

const cooperateTypeList = [
  'all',
  'member',
  'guest',
  'accepted',
  'rejected',
  'pending',
  'pending_members',
  'pending_guests',
];

export type CooperateType = typeof cooperateTypeList[number];
