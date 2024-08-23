import { create } from "zustand";
import { createSelectors } from "./selector";
import { persist } from "zustand/middleware";
import { io, Socket } from "socket.io-client";

interface IUserState {
	nickname: string;
	loginTime: string;
	isLogin: boolean;
	socket: Socket | null;
}

interface IUserActions {
	setNickName: (nickName: string) => void;
	setLoginTime: (loginTime: string) => void;
	setIsLogin: (isLogin: boolean) => void;
	setSocket: (socket: Socket | null) => void;
	setLoginUser: (nickname: string, loginTime: string) => void;
	setLogoutUser: () => void;
}

type TUserStore = IUserState & { actions: IUserActions };

const useUserStoreBase = create<TUserStore>()(
	persist(
		set => {
			return {
				nickname: "",
				loginTime: "",
				isLogin: false,
				socket: null,

				actions: {
					setNickName: (nickname: string) =>
						set({ nickname: nickname }),
					setLoginTime: (loginTime: string) => set({ loginTime }),
					setIsLogin: (isLogin: boolean) => set({ isLogin }),
					setSocket: socket => set({ socket }),
					setLoginUser: (nickname: string, loginTime: string) =>
						set({
							nickname,
							loginTime,
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
				loginTime: state.loginTime,
				isLogin: state.isLogin,
			}),
		}
	)
);

export const useUserStore = createSelectors(useUserStoreBase);
