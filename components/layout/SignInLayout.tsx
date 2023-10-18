import TopSlider from '@component/auth/TopSlider';

const SignInLayout = (props: any) => {
  return (
    <div className="flex-1 h-screen flex justify-center">
      <div className="w-full flex flex-row">
        <div className="w-3/10">
          <div className="overflow-hidden border-black">
            <TopSlider />
          </div>
        </div>
        <div className="ml-80px flex-1 flex flex-col justify-center">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default SignInLayout;
