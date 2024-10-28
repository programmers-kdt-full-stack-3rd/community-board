import { create } from "zustand";
import { TModalVariant } from "../component/common/Modal/Modal";

interface IGlobalErrorModalState {
	isOpen: boolean;
	callback?: () => void;
	title: string;
	message: string;
	variant: TModalVariant;
}

interface IOpenActionParam {
	title: string;
	message: string;
	variant?: TModalVariant;
	callback?: () => void;
}

interface IOpenWithMessageSplitActionParam {
	messageWithTitle: string;
	variant?: TModalVariant;
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
	variant: "error",

	open: param =>
		set(state => ({
			...state,
			...param,
			isOpen: true,
		})),

	openWithMessageSplit: ({ messageWithTitle, ...param }) => {
		const delimiterIndex = messageWithTitle.indexOf(":");

		if (delimiterIndex >= 0) {
			set(state => ({
				...state,
				...param,
				title: messageWithTitle.slice(0, delimiterIndex).trim(),
				message: messageWithTitle.slice(delimiterIndex + 1).trim(),
				isOpen: true,
			}));
		} else {
			set(state => ({
				...state,
				...param,
				title: "",
				message: messageWithTitle.trim(),
				isOpen: true,
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
			variant: "error",
		})),
}));
