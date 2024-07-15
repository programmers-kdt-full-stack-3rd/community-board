import { create } from "zustand";
import { createSelectors } from "./selector";

interface IUserState {
  nickname: string;
  loginTime: string;
  isLogin: boolean;
}

interface IUserActions {
  setNickName: (nickName: string) => void;
  setLoginTime: (loginTime: string) => void;
  setIsLogin: (isLogin: boolean) => void;
  setLoginUser: (nickname: string, loginTime: string) => void;
  setLogoutUser: () => void;
}

type TUserStore = IUserState & { actions: IUserActions };

const useUserStoreBase = create<TUserStore>((set) => {
  return {
    nickname: "",
    loginTime: "",
    isLogin: false,

    actions: {
      setNickName: (nickname: string) => set({ nickname: nickname }),
      setLoginTime: (loginTime: string) => set({ loginTime }),
      setIsLogin: (isLogin: boolean) => set({ isLogin }),
      setLoginUser: (nickname: string, loginTime: string) =>
        set({ nickname, loginTime, isLogin: true }),
      setLogoutUser: () => set({ nickname: "", loginTime: "", isLogin: false }),
    },
  };
});

export const useUserStore = createSelectors(useUserStoreBase);
