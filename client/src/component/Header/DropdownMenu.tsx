import { forwardRef, ForwardRefRenderFunction } from "react";
import { dropdownMenu, dropdownMenuItem } from "./DropdownMenu.css";
import { NavigateFunction } from "react-router-dom";
import UserDeleteModal from "./UserDeleteModal";

interface DropdownMenuProps {
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

const DropdownMenu: ForwardRefRenderFunction<
	HTMLDivElement,
	DropdownMenuProps
> = ({ navigate, warningModal }, ref) => {
	const currentPath = window.location.pathname;

	const handleProfileUpdateClick = () => {
		navigate(`/checkPassword?next=profileUpdate&final=${currentPath}`);
	};

	const handleOAuthManageClick = () => {
		navigate(`/oauth`);
	};

	const handleWarningCorfirm = () => {
		warningModal.close();
		navigate(`/checkPassword?next=accountDelete`);
	};

	const handleAdminPageClick = () => {
		navigate(`/admin/userMgmt`);
	};

	return (
		<div
			ref={ref}
			className={dropdownMenu}
		>
			<div
				onClick={handleProfileUpdateClick}
				className={dropdownMenuItem}
			>
				회원정보 변경
			</div>
			<div
				onClick={handleOAuthManageClick}
				className={dropdownMenuItem}
			>
				소셜 로그인 연동 관리
			</div>
			<div
				onClick={warningModal.open}
				className={dropdownMenuItem}
			>
				회원 탈퇴
			</div>
			{/* 권한 확인 과정 구현 필요*/}
			<div
				onClick={handleAdminPageClick}
				className={dropdownMenuItem}
			>
				관리자 페이지
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

export default forwardRef(DropdownMenu);
