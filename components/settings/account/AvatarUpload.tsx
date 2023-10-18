import { useEffect, useRef } from 'react';
import Image from 'next/image';

import DefaultAvatarIcon from '@image/default_avatar.png';
import useFileUploadMutation from '@service/fileMutation';

const AvatarUpload = ({
  avatar,
  setAvatar,
  isLoading,
  setLoading,
  className,
}: {
  avatar: string;
  setAvatar: (newValue: string) => void;
  isLoading: boolean;
  setLoading: (newValue: boolean) => void;
  className?: string;
}) => {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const fileUploadMutation = useFileUploadMutation((newValues: string[]) => {
    if (newValues.length > 0) setAvatar(newValues[0]);
  });
  useEffect(() => {
    if (fileUploadMutation.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [fileUploadMutation.isLoading, setLoading]);

  const handleChange = (event: any) => {
    if (isLoading) {
    } else {
      fileUploadMutation.mutate(event.target.files);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInput}
        onChange={(e) => {
          handleChange(e);
        }}
        className="hidden h-0 w-0"
        accept="image/*"
      />
      <Image
        onClick={() => {
          if (fileInput.current) {
            fileInput.current.click();
          }
        }}
        src={avatar && avatar !== '' ? avatar : DefaultAvatarIcon}
        width={80}
        height={80}
        alt=""
        className={className ?? ''}
      />
    </>
  );
};

export default AvatarUpload;
