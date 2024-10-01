import React from "react";
import AlertModal, { IAlertModalRootProps } from "./AlertModal";
import { IModalBodyProps, IModalTitleProps } from "./Modal";

interface IGlobalErrorModalRootProps extends IAlertModalRootProps {
	callback?: () => void;
}

type TGlobalErrorModalComponent = React.FC<IGlobalErrorModalRootProps> & {
	Title: React.FC<IModalTitleProps>;
	Body: React.FC<IModalBodyProps>;
};

const GlobalErrorModalRoot: React.FC<IGlobalErrorModalRootProps> = ({
	callback,
	children,
	...baseModalProps
}) => {
	const handleClose = () => {
		if (typeof callback === "function") {
			callback();
		}

		if (typeof baseModalProps.onClose === "function") {
			baseModalProps.onClose();
		}
	};

	return (
		<AlertModal
			{...baseModalProps}
			variant="error"
			onClose={handleClose}
		>
			{children}
		</AlertModal>
	);
};

const GlobalErrorModal = GlobalErrorModalRoot as TGlobalErrorModalComponent;
GlobalErrorModal.Title = AlertModal.Title;
GlobalErrorModal.Body = AlertModal.Body;

export default GlobalErrorModal;
