import { IconWrap } from '@component/general/wrap';
import GoogleCalendarIcon from '@svg/google-calendar.svg';

const CalendarSettingRow = ({
  title,
  linkText,
  onLink,
  disabled,
  isGoogleLogin,
  isCheckingToken,
  isTokenExpired,
  onTokenExpired,
}: {
  title: string;
  linkText: string;
  onLink: () => void;
  disabled?: boolean;
  isGoogleLogin?: boolean;
  isCheckingToken?: boolean;
  isTokenExpired?: boolean;
  onTokenExpired?: () => void;
}) => {
  return (
    <div className="py-12px w-full flex-row--between">
      <div className="flex items-center">
        <IconWrap additionalClass="bg-backgroundPrimary">
          <GoogleCalendarIcon width={20} height={20} />
        </IconWrap>
        <span className="ml-16px body1 text-fontPrimary">{title}</span>
      </div>
      <div
        className={`body1 text-primary ${
          disabled ? 'opacity-40' : ''
        } flex items-center`}
      >
        {isTokenExpired ? (
          <span
            className="mr-4 cursor-pointer hover:opacity-80"
            onClick={onTokenExpired ?? (() => {})}
          >
            セッション切れ
          </span>
        ) : isCheckingToken ? (
          <span className="mr-4 relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
        ) : null}
        <span
          className="hover:opacity-80 cursor-pointer"
          onClick={() => {
            if (!disabled) onLink();
          }}
        >
          {linkText}
        </span>
      </div>
    </div>
  );
};

export default CalendarSettingRow;

{
  /* {isGoogleLogin ? (
        <>
          <div
            id="g_id_onload"
            className={`body1 text-primary hover:opacity-80 cursor-pointer ${
              disabled ? 'opacity-40' : ''
            }`}
            data-client_id="498542936471-viaf2tpel9hdmifsr3ruocg7395b6ker.apps.googleusercontent.com"
            data-context="use"
            data-login_uri="http://localhost:3000/login"
            data-auto_select="true"
            data-itp_support="true"
          >
            {linkText}
          </div>
          <div
            className="g_id_signin"
            data-type="standard"
            data-size="large"
            data-theme="outline"
            data-text="sign_in_with"
            data-shape="rectangular"
            data-logo_alignment="left"
          ></div>
        </>
      ) : (
        <div
          className={`body1 text-primary hover:opacity-80 cursor-pointer ${
            disabled ? 'opacity-40' : ''
          }`}
          onClick={() => {
            if (!disabled) onLink();
          }}
        >
          {linkText}
        </div>
      )} */
}
