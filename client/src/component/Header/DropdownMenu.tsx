import { FC } from "react";
import { dropdownMenu, dropdownMenuItem } from "./DropdownMenu.css";
import { NavigateFunction } from "react-router-dom";
import UserDeleteModal from "./UserDeleteModal";

interface DropdownMenuProps {
  ref: React.RefObject<HTMLDivElement>;
  navigate: NavigateFunction;
  warningModal: { isOpen: boolean; open: () => void; close: () => void };
}

const MODAL_CONFIGS = {
  warning: {
    title: "회원 탈퇴 안내",
    message: "회원 탈퇴를 진행하시겠습니까?",
    cancelText: "취소",
    confirmText: "계속 진행",
    isWarning: false,
  },
};

const DropdownMenu: FC<DropdownMenuProps> = ({
  ref,
  navigate,
  warningModal,
}) => {
  const currentPath = window.location.pathname;

  const handleProfileUpdateClick = () => {
    navigate(`/checkPassword?next=profileUpdate&final=${currentPath}`);
  };

  const handleWarningCorfirm = () => {
    warningModal.close();
    navigate(`/checkPassword?next=accountDelete`);
  };

  return (
    <div ref={ref} className={dropdownMenu}>
      <div onClick={handleProfileUpdateClick} className={dropdownMenuItem}>
        회원정보 변경
      </div>
      <div onClick={warningModal.open} className={dropdownMenuItem}>
        회원 탈퇴
      </div>

      <UserDeleteModal
        {...MODAL_CONFIGS.warning}
        isOpen={warningModal.isOpen}
        onClose={warningModal.close}
        onConfirm={handleWarningCorfirm}
      />
    </div>
  );
};

export default DropdownMenu;
