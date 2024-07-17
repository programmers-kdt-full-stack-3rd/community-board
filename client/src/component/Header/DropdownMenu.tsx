import { FC } from "react";
import { dropdownMenu, dropdownMenuItem } from "./DropdownMenu.css";
import { NavigateFunction } from "react-router-dom";

interface DropdownMenuProps {
  ref: React.RefObject<HTMLDivElement>;
  navigate: NavigateFunction;
}

const DropdownMenu: FC<DropdownMenuProps> = ({ ref, navigate }) => {
  const currentPath = window.location.pathname;
  const handleProfileUpdateClick = () => {
    navigate(`/checkPassword?next=profileUpdate&final=${currentPath}`);
  };

  const handleAccountDeletionClick = () => {
    navigate("/checkPassword?next=accountDelete");
  };

  return (
    <div ref={ref} className={dropdownMenu}>
      <div onClick={handleProfileUpdateClick} className={dropdownMenuItem}>
        회원정보 변경
      </div>
      <div onClick={handleAccountDeletionClick} className={dropdownMenuItem}>
        회원 탈퇴
      </div>
    </div>
  );
};

export default DropdownMenu;
