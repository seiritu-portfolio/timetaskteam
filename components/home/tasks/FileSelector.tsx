import { useEffect, useRef } from 'react';
import useFileUploadMutation from '@service/fileMutation';
import FileUploaded, { UploadFile } from './FileUploaded';

const FileSelect = ({
  uploadedList,
  onSelect,
  additionalClass,
  isLoading,
  setLoading,
}: {
  uploadedList: string[];
  onSelect: (newVale: string[]) => void;
  additionalClass?: string;
  isLoading: boolean;
  setLoading: (newValue: boolean) => void;
}) => {
  const fileInput = useRef<HTMLInputElement | null>(null);

  const fileUploadMutation = useFileUploadMutation((newValues: string[]) => {
    // onSelect(newValues);
    onSelect([...uploadedList, ...newValues]);
  });
  useEffect(() => {
    if (fileUploadMutation.isLoading && setLoading != undefined) {
      setLoading(true);
    } else if (setLoading != undefined) {
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
        multiple
        onChange={(e) => {
          handleChange(e);
        }}
        className="hidden h-0 w-0"
        // accept="image/*, application/msword, application/vnd.ms-excel, application/vnd, ms-powerpoint, text/plain, application/pdf, image/*"
        accept="image/*"
      />
      <div
        onClick={() => {
          fileInput.current?.click();
        }}
        className={`px-18px py-12px h-44px rounded-r-8px bg-backgroundPrimary text-fontSecondary focus:bg-overlayWeb2 ${additionalClass} ${
          uploadedList.length > 0 ? 'hidden' : ''
        }`}
        tabIndex={9}
      >
        資料なし
      </div>
      <div className={`flex items-center ${additionalClass}`}>
        {uploadedList.length > 0 && (
          <>
            {uploadedList.map((file, index) => (
              <FileUploaded
                src={file}
                additionalClassname="mr-16px"
                key={`file-uploaded-src-${index}`}
              />
            ))}
            <UploadFile
              additionalClassname="cursor-pointer"
              onClick={() => {
                fileInput.current?.click();
              }}
            />
          </>
        )}
      </div>
      <div
        className={`${
          uploadedList.length > 0 ? 'flex items-center' : 'hidden'
        }`}
      ></div>
    </>
  );
};

export default FileSelect;
