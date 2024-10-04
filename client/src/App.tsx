import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./root.css";
import Login from "./page/User/Login";
import PostInfoPage from "./page/Posts/PostInfoPage";
import Join from "./page/User/Join";
import Main from "./page/Main/Main";
import Header from "./component/Header/Header";
import { justifyCenter, mainContainer } from "./App.css";
import CheckPassword from "./page/User/CheckPassword";
import ProfileUpdate from "./page/User/ProfileUpdate";
import clsx from "clsx";
import { useErrorModal } from "./state/errorModalStore";
import { useLayoutEffect } from "react";
import ErrorModal from "./component/utils/ErrorModal";
import OAuthRedirectHandler from "./page/OAuth/OAuthRedirectHandler";
import ChatTestPage from "./page/Chat/ChatPage";
import { AdminUserMgmtPage } from "./page/Admin/AdminUserMgmtPage";
import { AdminPostMgmtPage } from "./page/Admin/AdminPostMgmtPage";
import { AdminStatsPage } from "./page/Admin/AdminStatsPage";
import NotFound from "./page/error/NotFound";
import { useUserStore } from "./state/store";
import { io } from "socket.io-client";
import { AdminUserLogPage } from "./page/Admin/AdminUserLogPage";
import ChatAside from "./component/Chats/ChatAside/ChatAside";
import { useChatAside } from "./state/ChatAsideStore";
import OAuthLink from "./page/OAuth/OAuthLink";
import EmailRegistration from "./page/User/EmailRegistration";
import ChatBtn from "./component/Chats/ChatBtn/ChatBtn";
import UITest from "./page/UITest"; // TODO: UI 리팩터링 완료 후 테스트 import 제거
import Community from "./page/Category/Community";
import { AdminPage } from "./page/Admin/AdminPage";

function MainContainer({ children }: { children: React.ReactNode }) {
	const location = useLocation();

	// 중앙 정렬이 필요한 페이지들
	const centerJustifyRoutes = [
		"/login",
		"/join",
		"/checkPassword",
		"/profileUpdate",
		"/emailRegistration",
		"/oauth",
	];

	if (location.pathname === "/") {
		return <>{children}</>; // 메인 페이지에서는 children만 렌더링
	}

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
	const errorModal = useErrorModal();

	const isLogin = useUserStore.use.isLogin();
	const socket = useUserStore.use.socket();
	const { isOpen } = useChatAside();

	const { setSocket } = useUserStore.use.actions();

	useLayoutEffect(() => {
		errorModal.clear();

		// 로그인은 되어 있으나 소켓이 없는 경우
		if (isLogin && !socket) {
			setSocket(
				io(`${import.meta.env.VITE_CHAT_ADDRESS}/chat`, {
					withCredentials: true,
				})
			);

			return;
		}

		// 로그인이 안되있으나 소켓이 있는 경우
		if (!isLogin && socket) {
			socket.disconnect();
			setSocket(null);
			return;
		}
	}, []);

	return (
		<div>
			<BrowserRouter>
				<Header />
				<MainContainer>
					{errorModal.isOpen && (
						<ErrorModal
							message={errorModal.errorMessage}
							onError={errorModal.onError}
							close={errorModal.close}
						/>
					)}
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
							path="/chat"
							element={<ChatTestPage />}
						/>
						<Route
							path="/admin"
							element={<AdminPage />}
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
						<Route
							path="/admin/userLog/:userId"
							element={<AdminUserLogPage />}
						/>
						<Route
							path="/oauth"
							element={<OAuthLink />}
						/>
						<Route
							path="/emailRegistration"
							element={<EmailRegistration />}
						/>
						{/* TODO: UI 리팩터링 완료 후 테스트 라우팅 제거 */}
						<Route
							path="/test/ui"
							element={<UITest />}
						/>
						<Route
							path="*"
							element={<NotFound />}
						/>
						<Route
							path="/category/community"
							element={<Community />}
						/>
					</Routes>
				</MainContainer>
				{isOpen && <ChatAside />}
				<ChatBtn />
			</BrowserRouter>
		</div>
	);
}

export default App;
