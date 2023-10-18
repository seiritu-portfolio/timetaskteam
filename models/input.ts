import { UserType } from './user';

export interface InputType {
  name: string;
  register: any;
}

export interface DefaultOptionType {
  label: string;
  value: string;
}

export interface GroupSelectProps {
  label: string;
  value: string;
  collabUsers: UserType[];
}

export interface IconSelectProps {
  label: string;
  value: number;
  icon: any;
}
