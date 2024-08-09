import { StateCreator, create } from "zustand";
import { PersistOptions, persist } from "zustand/middleware";

interface IErrorModalState {
	isOpen: boolean;
	onError?: () => void;
	errorMessage: string;
}

interface IErrorModalActions {
	open: () => void;
	close: () => void;
	clear: () => void;
	setErrorMessage: (msg: string) => void;
	setOnError: (onError: () => void) => void;
}

export interface TErrorModalStore
	extends IErrorModalState,
		IErrorModalActions {}

export type ErrorModalStatePersist = (
	config: StateCreator<TErrorModalStore>,
	options: PersistOptions<IErrorModalState>
) => StateCreator<TErrorModalStore>;

export const useErrorModal = create<TErrorModalStore>(
	(persist as ErrorModalStatePersist)(
		set => ({
			isOpen: false,
			errorMessage: "",
			open: () => set(state => ({ ...state, isOpen: true })),
			close: () => set(state => ({ ...state, isOpen: false })),
			clear: () =>
				set(state => ({ ...state, isOpen: false, error: undefined })),
			setErrorMessage: (msg: string) =>
				set(state => ({ ...state, errorMessage: msg })),
			setOnError: (onError: () => void) =>
				set(state => ({ ...state, onError: onError })),
		}),
		{
			name: "errorModalStore",
			partialize: state => ({ ...state, isOpen: false }),
		}
	)
);
