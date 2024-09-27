import { forwardRef, ForwardRefRenderFunction, useLayoutEffect } from "react";
import { NavigateFunction } from "react-router-dom";
import UserDeleteModal from "./UserDeleteModal";
import { useUserStore } from "../../state/store";
import { ApiCall } from "../../api/api";
import { getUserMyself } from "../../api/users/crud";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { AiOutlineUserDelete } from "react-icons/ai";
import { IoShareSocialOutline } from "react-icons/io5";
import { MdOutlineAttachEmail } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";

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
	const isEmailRegistered = useUserStore.use.isEmailRegistered();
	const { setIsEmailRegistered } = useUserStore.use.actions();

	const currentPath = window.location.pathname;

	useLayoutEffect(() => {
		// TODO: isEmailRegistered를 로그인 시 받아서 저장하도록 서버와 클라이언트 수정 필요
		ApiCall(
			() => getUserMyself(),
			err => {
				console.error("사용자 정보를 가져올 수 없습니다.", err);
			}
		).then(response => {
			if (response instanceof Error) {
				return;
			}

			setIsEmailRegistered(!!response.email);
		});
	}, []);

	const handleProfileUpdateClick = () => {
		navigate(`/checkPassword?next=profileUpdate&final=${currentPath}`);
	};

	const handleEmailRegistrationClick = () => {
		navigate(`/checkPassword?next=emailRegistration&final=${currentPath}`);
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
			className="bg-customGray absolute right-0 top-12 z-50 min-w-[160px] rounded-md"
		>
			<div className="m-4 cursor-pointer text-left text-base">
				<div
					className="flex flex-row items-center gap-2 py-2 hover:opacity-70"
					onClick={handleProfileUpdateClick}
				>
					<FaRegUserCircle />
					회원정보 변경
				</div>

				{!isEmailRegistered && (
					<div
						className="flex flex-row items-center gap-2 py-2 hover:opacity-70"
						onClick={handleEmailRegistrationClick}
					>
						<MdOutlineAttachEmail />
						이메일 등록
					</div>
				)}

				<div
					className="flex flex-row items-center gap-2 py-2 hover:opacity-70"
					onClick={handleOAuthManageClick}
				>
					<IoShareSocialOutline />
					로그인 연동
				</div>

				<div
					className="flex flex-row items-center gap-2 py-2 hover:opacity-70"
					onClick={warningModal.open}
				>
					<AiOutlineUserDelete />
					회원 탈퇴
				</div>

				{/* 권한 확인 과정 구현 필요 */}
				<div
					className="flex flex-row items-center gap-2 py-2 hover:opacity-70"
					onClick={handleAdminPageClick}
				>
					<MdOutlineAdminPanelSettings />
					관리자 페이지
				</div>

				<UserDeleteModal
					{...MODAL_CONFIGS.warning}
					isOpen={warningModal.isOpen}
					onClose={warningModal.close}
					onConfirm={handleWarningCorfirm}
				/>
			</div>
		</div>
	);
};

export default forwardRef(DropdownMenu);
