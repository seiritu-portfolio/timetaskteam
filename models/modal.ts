interface ModalDefaultProps {
  isOpen: boolean;
  close: () => void;
}

export interface ModalBulkTasksProps extends ModalDefaultProps {
  selectedList: number[];
}

export interface ModalSuccessProps extends ModalDefaultProps {
  onSuccess: () => void;
}

export default ModalDefaultProps;
