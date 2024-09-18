import { StateCreator, create } from "zustand";
import { PersistOptions, persist } from "zustand/middleware";

interface IChatAsideState {
	isOpen: boolean;
}

interface IChatAsideActions {
	open: () => void;
	close: () => void;
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
			open: () => set(() => ({ isOpen: true })),
			close: () => set(() => ({ isOpen: false })),
		}),
		{
			name: "ChatAsideStore",
			partialize: state => ({
				isOpen: state.isOpen,
			}),
		}
	)
);
