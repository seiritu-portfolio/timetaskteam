import Modal from 'react-responsive-modal';

import ListEdit from './ListEdit';
import CloseIcon from '@svg/multiply.svg';
import ModalDefaultProps from '@model/modal';
import ListSidemenu from './ListSideMenu';
// import Draggable from 'react-draggable';

const ModalList = ({ isOpen, close }: ModalDefaultProps) => {
  return (
    <>
      <Modal
        open={isOpen}
        onClose={close}
        center
        classNames={{
          overlay: 'modal-overlay',
          modal: 'list-modal',
          modalContainer: 'list-modal-container',
          root: 'list-modal-root',
        }}
        onOverlayClick={() => {
          close();
        }}
        blockScroll={true}
        closeIcon={
          <CloseIcon
            width={20}
            height={20}
            className="mt-8px mr-12px text-fontSecondary"
          />
        }
      >
        <div className="w-full h-full flex flex-row">
          <ListSidemenu />
          <ListEdit />
        </div>
      </Modal>
    </>
  );
};

export default ModalList;
