import clsx from "clsx";
import React, { createContext, useContext, useMemo } from "react";
import { createPortal } from "react-dom";
import { FiAlertTriangle, FiInfo, FiXCircle } from "react-icons/fi";

type TModalVariant = "error" | "warning" | "info" | "base";

interface IModalContextValue {
	variant?: TModalVariant;
}

interface IModalRootProps {
	children: React.ReactNode;
	variant?: TModalVariant;
	isOpen?: boolean;
	onClose?: () => void;
}

interface IModalTitleProps {
	children: React.ReactNode;
}

interface IModalBodyProps {
	children: React.ReactNode;
}

interface IModalFooterProps {
	children: React.ReactNode;
}

type TModalComponent = React.FC<IModalRootProps> & {
	Title: React.FC<IModalTitleProps>;
	Body: React.FC<IModalBodyProps>;
	Footer: React.FC<IModalFooterProps>;
};

const modalRootElement = document.getElementById("modal-root")!;

const ModalContext = createContext<IModalContextValue>({});

const ModalRoot: React.FC<IModalRootProps> = ({
	children,
	variant = "base",
	isOpen,
	onClose,
}) => {
	const contextValue: IModalContextValue = useMemo(
		() => ({
			variant,
		}),
		[variant]
	);

	const handleClose = () => {
		if (typeof onClose === "function") {
			onClose();
		}
	};

	return (
		<>
			{isOpen &&
				createPortal(
					<ModalContext.Provider value={contextValue}>
						<div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/50">
							<div
								className="absolute inset-0 -z-10 h-full w-full"
								onClick={handleClose}
							/>
							<section className="dark:bg-customDarkGray flex max-h-full w-96 flex-col gap-6 rounded-lg bg-white p-6 shadow-lg dark:border-l dark:border-t dark:border-white/5">
								{children}
							</section>
						</div>
					</ModalContext.Provider>,
					modalRootElement
				)}
		</>
	);
};

const ModalTitle: React.FC<IModalTitleProps> = ({ children }) => {
	const { variant = "base" } = useContext(ModalContext);

	const classNameByVariant = {
		error: "text-red-600 dark:text-red-300",
		warning: "text-yellow-600 dark:text-yellow-300",
		info: "text-blue-600 dark:text-blue-300",
		base: "text-neutral-600 dark:text-neutral-300",
	};

	const iconByVariant = {
		error: <FiXCircle />,
		warning: <FiAlertTriangle />,
		info: <FiInfo />,
		base: null,
	};

	return (
		<header
			className={clsx(
				"flex items-center justify-center gap-2 text-2xl",
				classNameByVariant[variant] ?? classNameByVariant.base
			)}
		>
			{iconByVariant[variant]}
			<h2 className="font-bold text-inherit">{children}</h2>
		</header>
	);
};

const ModalBody: React.FC<IModalBodyProps> = ({ children }) => {
	return <div className="text-lg">{children}</div>;
};

const ModalFooter: React.FC<IModalFooterProps> = ({ children }) => {
	return <footer className="flex justify-end gap-4">{children}</footer>;
};

const Modal = ModalRoot as TModalComponent;
Modal.Title = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
