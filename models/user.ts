export interface UserType {
  id: number;
  avatar: string;
  name: string;
  email: string;
  color?: string;
  onClickLeft?: () => void;
  onClickRight?: () => void;
}

export interface UserWithApproveType extends UserType {
  approved: boolean;
}

export interface UserAddRequestType extends UserType {
  onAccept: any;
  onReject?: any;
}

export interface GroupType {
  id: number;
  name: string;
  users: UserType[];
}

export interface UserAddType {
  user: string | null;
  userType: string | null;
  group: string | null;
  color: string | null;
}

export interface UserAddSubmitType {
  coop_user_id: number;
  role: number;
  group_ids: number[];
  color: number;
}
