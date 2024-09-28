import React from "react";
import { createPortal } from "react-dom";

interface IModalRootProps {
	children: React.ReactNode;
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

const ModalRoot: React.FC<IModalRootProps> = ({
	children,
	isOpen,
	onClose,
}) => {
	const handleClose = () => {
		if (typeof onClose === "function") {
			onClose();
		}
	};

	return (
		<>
			{isOpen &&
				createPortal(
					<div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/50">
						<div
							className="absolute inset-0 -z-10 h-full w-full"
							onClick={handleClose}
						/>
						<section className="bg-customDarkGray flex max-h-full w-96 flex-col gap-6 rounded-lg p-6 shadow-lg">
							{children}
						</section>
					</div>,
					modalRootElement
				)}
		</>
	);
};

const ModalTitle: React.FC<IModalTitleProps> = ({ children }) => {
	return (
		<header className="text-center text-2xl font-bold text-neutral-300">
			<h2>{children}</h2>
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
