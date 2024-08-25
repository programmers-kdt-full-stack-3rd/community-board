import {
	FiLogIn,
	FiLogOut,
	FiUser,
	FiUserPlus,
	FiChevronDown,
	FiMessageSquare,
} from "react-icons/fi";
import { FaComments } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { sendPostLogoutRequest } from "../../api/users/crud";
import { useUserStore } from "../../state/store";
import {
	button,
	header,
	iconButtonGroup,
	nicknameInfo,
	siteTitle,
	userAuthPanel,
} from "./Header.css";
import { useEffect, useRef, useState } from "react";
import DropdownMenu from "./DropdownMenu";
import { useModal } from "../../hook/useModal";
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";

const Header: React.FC = () => {
	const navigate = useNavigate();
	const isLogin = useUserStore.use.isLogin();
	const nickname = useUserStore.use.nickname();
	const socket = useUserStore.use.socket();
	const { setLogoutUser } = useUserStore.use.actions();
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const dropdownMenuRef = useRef<HTMLDivElement>(null);

	// Modal hooks
	const warningModal = useModal();

	// 드랍다운 메뉴 이외 클릭시 드랍다운 메뉴 닫기
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownMenuRef.current &&
				!dropdownMenuRef.current.contains(e.target as Node)
			) {
				setIsUserMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleLogin = () => {
		const currentPath = window.location.pathname;
		navigate(`/login?redirect=${currentPath}`);
	};

	const handleLogout = async () => {
		const result = await ApiCall(
			() => sendPostLogoutRequest(),
			() => {}
		);

		if (result instanceof ClientError) {
			return;
		}

		if (socket) {
			socket.disconnect();
			console.log("로그아웃, socket disconnect");
		}

		setLogoutUser();
	};

	const handleUserInfo = () => {
		setIsUserMenuOpen(!isUserMenuOpen);
	};

	const handleJoin = () => {
		navigate("/join");
	};

	return (
		<div className={header}>
			<Link
				to="/"
				className={siteTitle}
			>
				<FaComments />
				<span>CODEPLAY</span>
			</Link>
			<div className={userAuthPanel}>
				{isLogin && (
					<div className={nicknameInfo}>
						{nickname}님 환영 합니다.
					</div>
				)}
				<div className={iconButtonGroup}>
					<div className={button}>
						<Link to="/chat">
							<FiMessageSquare
								size="30"
								title="채팅"
								color="#ffffff"
							/>
						</Link>
					</div>
					<div
						className={button}
						onClick={isLogin ? handleLogout : handleLogin}
					>
						{isLogin ? (
							<FiLogOut
								size="30"
								title="로그아웃"
							/>
						) : (
							<FiLogIn
								size="30"
								title="로그인"
							/>
						)}
					</div>
					<div
						onClick={isLogin ? handleUserInfo : handleJoin}
						className={button}
					>
						{isLogin ? (
							<div className={button}>
								<FiUser
									size="30"
									title="유저정보"
								/>
								<FiChevronDown size="20" />
							</div>
						) : (
							<FiUserPlus
								size="30"
								title="회원가입"
							/>
						)}
					</div>
					{isUserMenuOpen &&
						isLogin &&
						DropdownMenu({
							ref: dropdownMenuRef,
							navigate: navigate,
							warningModal: warningModal,
						})}
				</div>
			</div>
		</div>
	);
};

export default Header;
