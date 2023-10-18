const Loading = ({ additionalClass }: { additionalClass?: string }) => (
  <div
    className={`absolute flex justify-center items-center ${
      additionalClass ?? ''
    }`}
  >
    <div
      className="spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0"
      role="status"
    >
      <span className="visually-hidden">ロード...</span>
    </div>
  </div>
);

export default Loading;

export const Loading01 = ({
  loading,
  additionalClass,
}: {
  loading: boolean;
  additionalClass?: string;
}) => {
  return (
    <div
      className={`lds-dual-ring-general absolute ${
        loading ? '' : 'invisible'
      } ${additionalClass ?? ''}`}
    />
  );
};
