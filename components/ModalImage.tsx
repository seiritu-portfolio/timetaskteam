import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-responsive-modal';

import { previewImageSelector } from '@store/selectors/home';
import { IMAGE_LOAD_ERRORS } from '@util/urls';
import { setPreviewImageUrl } from '@store/modules/home';

const ModalImage = () => {
  const previewImageUrl = useSelector(previewImageSelector);
  const dispatch = useDispatch();
  const [imgSrc, setImgSrc] = useState('');
  useEffect(() => {
    if (previewImageUrl !== '') {
      setImgSrc(previewImageUrl);
    } else {
    }
  }, [previewImageUrl]);
  const imgRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const onLoad = (img: any) => {
    if (imgRef.current && modalRef.current) {
      const { innerWidth: width, innerHeight: height } = window;
      const { clientWidth: imgWidth, clientHeight: imgHeight } = imgRef.current;

      if (imgWidth < width - 160) {
        modalRef.current.style.width = `${imgWidth}px`;
      } else {
        modalRef.current.style.width = `${width - 160}px`;
        modalRef.current.style.marginLeft = '80px';
        modalRef.current.style.marginRight = '80px';
      }
      if (imgHeight < height - 160) {
        modalRef.current.style.height = `${imgHeight}px`;
      } else {
        modalRef.current.style.height = `${height - 160}px`;
        modalRef.current.style.marginTop = '80px';
        modalRef.current.style.marginBottom = '80px';
      }
    }
  };

  return (
    <Modal
      ref={modalRef}
      open={previewImageUrl != ''}
      onClose={() => {
        dispatch(setPreviewImageUrl(''));
      }}
      center
      showCloseIcon={false}
      classNames={{
        modal: 'modal-image',
      }}
    >
      <img
        ref={imgRef}
        src={imgSrc}
        alt="プレビュー"
        onLoad={onLoad}
        onError={() => {
          setImgSrc(
            IMAGE_LOAD_ERRORS[
              Math.floor(Math.random() * IMAGE_LOAD_ERRORS.length)
            ],
          );
        }}
      />
    </Modal>
  );
};

export default ModalImage;
