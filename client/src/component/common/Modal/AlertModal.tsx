import React from "react";
import Modal, {
	IModalBodyProps,
	IModalRootProps,
	IModalTitleProps,
} from "./Modal";
import Button from "../Button";

interface IAlertModalRootProps extends IModalRootProps {
	okButtonLabel?: React.ReactNode;
}

type TAlertModalComponent = React.FC<IAlertModalRootProps> & {
	Title: React.FC<IModalTitleProps>;
	Body: React.FC<IModalBodyProps>;
};

const AlertModalRoot: React.FC<IAlertModalRootProps> = ({
	okButtonLabel = "확인",
	children,
	...baseModalProps
}) => {
	return (
		<Modal {...baseModalProps}>
			{children}

			<Modal.Footer>
				<Button
					color="action"
					onClick={baseModalProps.onClose}
				>
					{okButtonLabel}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

const AlertModal = AlertModalRoot as TAlertModalComponent;
AlertModal.Title = Modal.Title;
AlertModal.Body = Modal.Body;

export default AlertModal;
