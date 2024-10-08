import {
	FiLogIn,
	FiLogOut,
	FiUser,
	FiUserPlus,
	FiChevronDown,
} from "react-icons/fi";
import { FaComments } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { sendPostLogoutRequest } from "../../api/users/crud";
import { useUserStore } from "../../state/store";
import { useEffect, useRef, useState } from "react";
import DropdownMenu from "./DropdownMenu";
import { ApiCall } from "../../api/api";
import { ClientError } from "../../api/errors";
import { useChatRoom } from "../../state/ChatRoomStore";
import { isDevMode } from "../../utils/detectMode"; // TODO: UI 리팩터링 완료 후 테스트 import 제거
import { MdDarkMode } from "react-icons/md";
import useThemeStore from "../../state/ThemeStore";
import { MdLightMode } from "react-icons/md";

const Header: React.FC = () => {
	const navigate = useNavigate();
	const isLogin = useUserStore.use.isLogin();
	const nickname = useUserStore.use.nickname();
	const imgUrl = useUserStore.use.imgUrl();
	const socket = useUserStore.use.socket();
	const { setLogoutUser } = useUserStore.use.actions();
	const { initializeChatState } = useChatRoom();
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const dropdownMenuRef = useRef<HTMLDivElement>(null);
	const { isDarkMode, toggleDarkMode } = useThemeStore();

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

	useEffect(() => {
		if (isDarkMode) {
			document.body.classList.add("dark");
		} else {
			document.body.classList.remove("dark");
		}
	}, [isDarkMode]);

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
		initializeChatState();
		navigate("");
	};

	const handleUserInfo = () => {
		setIsUserMenuOpen(!isUserMenuOpen);
	};

	const handleJoin = () => {
		navigate("/join");
	};

	return (
		<div>
			<div className="dark:bg-customGray sticky top-16 z-20 flex h-16 items-center bg-blue-900 py-5 text-sm sm:top-0">
				<nav className="mx-auto flex w-full max-w-7xl gap-x-10 px-4 lg:px-0">
					<div className="ml-2 flex items-center">
						<Link
							to="/"
							className="flex items-center gap-2"
						>
							<FaComments className="text-xl text-white" />
							<span className="text-2xl font-bold text-white">
								CODEPLAY
							</span>
						</Link>
					</div>

					<div className="flex-1 justify-between sm:flex">
						<div className="hidden text-white hover:text-gray-300 sm:flex sm:items-center sm:gap-x-4 xl:gap-x-6">
							<Link
								to="/category/community"
								className="text-white hover:text-gray-300"
							>
								자유게시판
							</Link>

							<a className="text-white hover:text-gray-300">
								QnA
							</a>
							<a className="text-white hover:text-gray-300">
								팀원모집
							</a>
							<a className="text-white hover:text-gray-300">
								도전과제
							</a>
							<a className="text-white hover:text-gray-300">
								공지
							</a>
						</div>
					</div>

					<div className="shrink-0 items-center justify-end gap-x-2 sm:flex lg:w-[180px] lg:gap-x-4">
						<div className="right-0 mr-4 hidden shrink-0 items-center gap-x-3 sm:flex">
							{isDevMode() && (
								<Link to="/test/ui">UI 컴포넌트 테스트</Link>
							)}

							<div
								className="dark:bg-customDarkGray flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white"
								onClick={toggleDarkMode}
							>
								{isDarkMode ? (
									<MdDarkMode className="text-white" />
								) : (
									<MdLightMode className="text-blue-900" />
								)}
							</div>

							{isLogin && (
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										gap: "5px",
									}}
								>
									<img
										src={imgUrl}
										style={{
											width: "40px",
											height: "40px",
											borderRadius: "50%",
											objectFit: "cover",
										}}
									/>
									<div
										style={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										{nickname}님 환영 합니다.
									</div>
								</div>
							)}
							<div
								className="text-lg text-white"
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
								className="relative text-lg text-white"
							>
								{isLogin ? (
									<div className="flex items-center">
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

								{isUserMenuOpen && isLogin && (
									<DropdownMenu ref={dropdownMenuRef} />
								)}
							</div>
						</div>
					</div>
				</nav>
			</div>
		</div>
	);
};

export default Header;
