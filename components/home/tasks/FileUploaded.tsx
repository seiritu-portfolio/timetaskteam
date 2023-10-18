import { useDispatch } from 'react-redux';
import Image from 'next/image';

import UploadIcon from '@svg/square-and-arrow-down.svg';
import DefaultUploadedImage from '@image/uploaded.png';
import { setPreviewImageUrl } from '@store/modules/home';

const FileUploaded = ({
  src,
  additionalClassname,
}: {
  src: string;
  additionalClassname?: string;
}) => {
  const dispatch = useDispatch();

  return (
    <div
      className={`h-44px w-44px rounded-8px border border-separator flex-xy-center cursor-pointer ${additionalClassname}`}
      onClick={() => {
        if (src !== '') dispatch(setPreviewImageUrl(src));
      }}
    >
      <Image
        src={src && src !== '' ? src : DefaultUploadedImage}
        width={44}
        height={44}
        alt=""
        className="rounded-8px object-cover"
      />
    </div>
  );
};

export default FileUploaded;
export { UploadFile };

const UploadFile = ({
  additionalClassname,
  onClick,
}: {
  additionalClassname: string;
  onClick: any;
}) => {
  return (
    <div
      className={`h-44px w-44px rounded-8px bg-backgroundPrimary text-fontSecondary flex-xy-center ${additionalClassname}`}
      onClick={onClick}
    >
      <UploadIcon width={20} height={20} />
    </div>
  );
};
