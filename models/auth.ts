export interface TwoFactorChallengeProp {
  provider: string;
  email: string;
  password: string;
  id_token: string;
  device_name: string;
  code: string;
}
