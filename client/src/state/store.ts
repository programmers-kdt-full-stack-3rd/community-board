import { create } from "zustand";
import { createSelectors } from "./selector";
import { persist } from "zustand/middleware";
import { io, Socket } from "socket.io-client";
import profileIcon from "../assets/icons/profile-icon.svg";
import { ILoginUserInfo } from "shared";

interface IUserState {
	nickname: string;
	email: string;
	imgUrl: string;
	loginTime: string;
	isLogin: boolean;
	isEmailRegistered: boolean;
	socket: Socket | null;
}

interface IUserActions {
	setNickName: (nickName: string) => void;
	setEmail: (email: string) => void;
	setImgUrl: (imgUrl: string) => void;
	setLoginTime: (loginTime: string) => void;
	setIsLogin: (isLogin: boolean) => void;
	setIsEmailRegistered: (isEmailRegistered: boolean) => void;
	setSocket: (socket: Socket | null) => void;
	setLoginUser: (userInfo: ILoginUserInfo) => void;
	setLogoutUser: () => void;
}

type TUserStore = IUserState & { actions: IUserActions };

const useUserStoreBase = create<TUserStore>()(
	persist(
		set => {
			return {
				nickname: "",
				email: "",
				imgUrl: "",
				loginTime: "",
				isLogin: false,
				isEmailRegistered: false,
				socket: null,

				actions: {
					setNickName: (nickname: string) =>
						set({ nickname: nickname }),
					setEmail: (email: string) => set({ email: email }),
					setImgUrl: (imgUrl: string) => set({ imgUrl: imgUrl }),
					setLoginTime: (loginTime: string) => set({ loginTime }),
					setIsLogin: (isLogin: boolean) => set({ isLogin }),
					setSocket: socket => set({ socket }),
					setIsEmailRegistered: (isEmailRegistered: boolean) =>
						set({ isEmailRegistered }),
					setLoginUser: (userInfo: ILoginUserInfo) =>
						set({
							nickname: userInfo.nickname,
							loginTime: userInfo.loginTime,
							email: userInfo.email ?? "",
							imgUrl: userInfo.imgUrl ?? profileIcon,
							isLogin: true,
							socket: io(
								`${import.meta.env.VITE_CHAT_ADDRESS}/chat`,
								{
									withCredentials: true,
								}
							),
						}),
					setLogoutUser: () =>
						set({
							nickname: "",
							loginTime: "",
							isLogin: false,
							socket: null,
						}),
				},
			};
		},
		{
			name: "userStorage",
			partialize: state => ({
				nickname: state.nickname,
				email: state.email,
				imgUrl: state.imgUrl,
				loginTime: state.loginTime,
				isLogin: state.isLogin,
				isEmailRegistered: state.isEmailRegistered,
			}),
		}
	)
);

export const useUserStore = createSelectors(useUserStoreBase);
