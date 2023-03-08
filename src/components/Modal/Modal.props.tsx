export type ModalProps = {
  title?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
};
