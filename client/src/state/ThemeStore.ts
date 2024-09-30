import create from "zustand";
import { persist } from "zustand/middleware";

interface IThemeState {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
}

const useThemeStore = create<IThemeState>()(
	persist(
		set => ({
			isDarkMode: false,
			toggleDarkMode: () =>
				set(state => ({ isDarkMode: !state.isDarkMode })), // 상태를 반전하는 함수
		}),
		{
			name: "themeStorage",
			partialize: state => ({ isDarkMode: state.isDarkMode }),
		}
	)
);

export default useThemeStore;
