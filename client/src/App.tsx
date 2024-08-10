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
import { useLayoutEffect } from "react";
import ErrorModal from "./component/utils/ErrorModal";
import ChatTestPage from "./page/Chat/ChatTestPage";
import ChatRooms from "./component/Chats/ChatRooms";
import ChatRoom from "./component/Chats/ChatRoom";

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
	const errorModal = useErrorModal();

	useLayoutEffect(() => {
		errorModal.clear();
	}, []);

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
				<Header />
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
					</Routes>
				</MainContainer>
			</BrowserRouter>
		</div>
	);
}

export default App;
