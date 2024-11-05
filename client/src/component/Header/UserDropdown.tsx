import React, { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FiChevronDown, FiUser } from "react-icons/fi";
import { IoShareSocialOutline } from "react-icons/io5";
// import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { MdOutlineAttachEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../state/store";
import { sendGetUserMyself } from "../../api/users/crud";
//import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Dropdown from "../common/Dropdown";

const UserDropdown: React.FC = () => {
	const navigate = useNavigate();

	const [isOpen, setIsOpen] = useState(false);

	const isEmailRegistered = useUserStore.use.isEmailRegistered();
	const { setIsEmailRegistered } = useUserStore.use.actions();

	const currentPath = window.location.pathname;

	useEffect(() => {
		// TODO: isEmailRegistered를 로그인 시 받아서 저장하도록 서버와 클라이언트 수정 필요
		sendGetUserMyself().then(res => {
			if (res.error !== "") {
				console.error("유저 정보 조회 실패 :", res.error);
				return;
			}

			setIsEmailRegistered(!!res.nonSensitiveUser.email);
		});
	}, []);

	const handleProfileUpdateClick = () => {
		// navigate(`/checkPassword?next=profileUpdate&final=${currentPath}`);
		navigate("/profile");
	};

	const handleEmailRegistrationClick = () => {
		navigate(`/checkPassword?next=emailRegistration&final=${currentPath}`);
	};

	const handleOAuthManageClick = () => {
		navigate(`/oauth`);
	};

	// const handleAdminPageClick = () => {
	// 	navigate(`/admin`);
	// };

	return (
		<Dropdown
			isOpen={isOpen}
			onToggle={setIsOpen}
			toggleLabel={
				<>
					<FiUser
						size="30"
						title="유저 정보"
					/>
					<FiChevronDown size="20" />
				</>
			}
		>
			<Dropdown.Item
				icon={<FaRegUserCircle />}
				onClick={handleProfileUpdateClick}
			>
				마이페이지
			</Dropdown.Item>

			{!isEmailRegistered && (
				<Dropdown.Item
					icon={<MdOutlineAttachEmail />}
					onClick={handleEmailRegistrationClick}
				>
					이메일 등록
				</Dropdown.Item>
			)}

			<Dropdown.Item
				icon={<IoShareSocialOutline />}
				onClick={handleOAuthManageClick}
			>
				로그인 연동
			</Dropdown.Item>

			{/* TODO: 권한 확인 과정 구현 필요 */}
			{/* <Dropdown.Item
				icon={<MdOutlineAdminPanelSettings />}
				onClick={handleAdminPageClick}
			>
				관리자 페이지
			</Dropdown.Item> */}
		</Dropdown>
	);
};

export default UserDropdown;
