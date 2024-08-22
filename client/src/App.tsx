import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./root.css";
import Login from "./page/User/Login";
import PostInfoPage from "./page/Posts/PostInfoPage";
import Join from "./page/User/Join";
import Main from "./page/Main/Main";
import Header from "./component/Header/Header";
import { AppContainer, justifyCenter, mainContainer } from "./App.css";
import CheckPassword from "./page/User/CheckPassword";
import ProfileUpdate from "./page/User/ProfileUpdate";
import clsx from "clsx";
import { useErrorModal } from "./state/errorModalStore";
import { useEffect, useLayoutEffect, useState } from "react";
import ErrorModal from "./component/utils/ErrorModal";
import OAuthRedirectHandler from "./page/OAuthRedirectHandler";
import ChatTestPage from "./page/Chat/ChatTestPage";
import ChatRoom from "./component/Chats/ChatRoom/ChatRoom";
import ChatRooms from "./component/Chats/ChatRooms/ChatRooms";
import { useUserStore } from "./state/store";
import { io, Socket } from "socket.io-client";
import { AdminUserMgmtPage } from "./page/Admin/AdminUserMgmtPage";
import { AdminPostMgmtPage } from "./page/Admin/AdminPostMgmtPage";
import { AdminStatsPage } from "./page/Admin/AdminStatsPage";


function MainContainer({ children }: { children: React.ReactNode }) {
	const location = useLocation();

	// 중앙 정렬이 필요한 페이지들
	const centerJustifyRoutes = [
		"/login",
		"/join",
		"/checkPassword",
		"/profileUpdate",
	];

	return (
		<div
			className={clsx(mainContainer, {
				[justifyCenter]: centerJustifyRoutes.includes(
					location.pathname
				),
			})}
		>
			{children}
		</div>
	);
}

function App() {
	const [socket, setSocket] = useState<Socket | null>(null);
	const errorModal = useErrorModal();
	const isLogin = useUserStore(state => state.isLogin);

	useLayoutEffect(() => {
		errorModal.clear();
	}, []);

	useEffect(() => {
		if (isLogin) {
			// 로그인 성공 시 chat_server에 소켓 연결
			const socketInstance: Socket = io(
				`${import.meta.env.VITE_CHAT_ADDRESS}/chat`
			);

			socketInstance.on("connect", () => {
				console.log(
					"Connected to chat server with socket ID:",
					socketInstance.id
				);
			});

			socketInstance.on("disconnect", () => {
				console.log("Disconnected from chat server");
			});

			socketInstance.on("update_user_list", userList => {
				console.log("현재 접속 중인 사용자 목록:", userList);
			});

			setSocket(socketInstance);
		}
	}, [isLogin]);

	return (
		<div className={AppContainer}>
			<BrowserRouter>
				{errorModal.isOpen && (
					<ErrorModal
						message={errorModal.errorMessage}
						onError={errorModal.onError}
						close={errorModal.close}
					/>
				)}
				<Header socket={socket} />
				<MainContainer>
					<Routes>
						<Route
							path="/"
							element={<Main />}
						/>
						<Route
							path="/login"
							element={<Login />}
						/>
						<Route
							path="/join"
							element={<Join />}
						/>
						<Route
							path="/oauth/redirect/:provider"
							element={<OAuthRedirectHandler />}
						/>
						<Route
							path="/checkPassword"
							element={<CheckPassword />}
						/>
						<Route
							path="/profileUpdate"
							element={<ProfileUpdate />}
						/>
						<Route
							path="/post/:id"
							element={<PostInfoPage />}
						/>
						<Route
							path="/test"
							element={<ChatTestPage />}
						/>
						<Route
							path="/rooms"
							element={<ChatRooms />}
						/>
						<Route
							path="/room/:room_id"
							element={<ChatRoom />}
						/>
						<Route
							path="/admin/userMgmt"
							element={<AdminUserMgmtPage />}
						/>
						<Route
							path="/admin/postMgmt"
							element={<AdminPostMgmtPage />}
						/>
						<Route
							path="/admin/stats"
							element={<AdminStatsPage />}
						/>
					</Routes>
				</MainContainer>
			</BrowserRouter>
		</div>
	);
}

export default App;
