import { StateCreator, create } from "zustand";
import { PersistOptions, persist } from "zustand/middleware";

export enum ChatAsideCategory {
	SEARCH,
	MYROOM,
	SETTING,
}

interface IChatAsideState {
	isOpen: boolean;
	category: ChatAsideCategory;
	chatModalContainer: Element | null;
}

interface IChatAsideActions {
	open: () => void;
	close: () => void;
	setCategory: (category: ChatAsideCategory) => void;
	setChatModalContainer: (element: Element | null) => void;
}

export interface TChatAsideStore extends IChatAsideState, IChatAsideActions {}

export type ChatAsideStatePersist = (
	config: StateCreator<TChatAsideStore>,
	options: PersistOptions<IChatAsideState>
) => StateCreator<TChatAsideStore>;

export const useChatAside = create<TChatAsideStore>(
	(persist as ChatAsideStatePersist)(
		set => ({
			isOpen: false,
			category: ChatAsideCategory.SEARCH,
			chatModalContainer: null,
			open: () => set(() => ({ isOpen: true })),
			close: () => set(() => ({ isOpen: false })),
			setCategory: category => set(() => ({ category: category })),
			setChatModalContainer: element =>
				set(() => ({ chatModalContainer: element })),
		}),
		{
			name: "ChatAsideStore",
			partialize: state => ({
				isOpen: state.isOpen,
				category: state.category,
				chatModalContainer: null,
			}),
		}
	)
);
