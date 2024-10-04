import { create } from "zustand";

interface IGlobalErrorModalState {
	isOpen: boolean;
	callback?: () => void;
	title: string;
	message: string;
}

interface IOpenActionParam {
	title: string;
	message: string;
	callback?: () => void;
}

interface IOpenWithMessageSplitActionParam {
	messageWithTitle: string;
	callback?: () => void;
}

interface IGlobalErrorModalActions {
	open: (param: IOpenActionParam) => void;
	openWithMessageSplit: (param: IOpenWithMessageSplitActionParam) => void;
	close: () => void;
}

type TGlobalErrorModalStore = IGlobalErrorModalState & IGlobalErrorModalActions;

export const useGlobalErrorModal = create<TGlobalErrorModalStore>(set => ({
	isOpen: false,
	title: "",
	message: "",

	open: param =>
		set(state => ({
			...state,
			...param,
			isOpen: true,
		})),

	openWithMessageSplit: ({ messageWithTitle, callback }) => {
		const delimiterIndex = messageWithTitle.indexOf(":");

		if (delimiterIndex >= 0) {
			set(state => ({
				...state,
				callback,
				isOpen: true,
				title: messageWithTitle.slice(0, delimiterIndex).trim(),
				message: messageWithTitle.slice(delimiterIndex + 1).trim(),
			}));
		} else {
			set(state => ({
				...state,
				callback,
				isOpen: true,
				title: "",
				message: messageWithTitle.trim(),
			}));
		}
	},

	close: () =>
		set(state => ({
			...state,
			isOpen: false,
			callback: undefined,
			title: "",
			message: "",
		})),
}));
