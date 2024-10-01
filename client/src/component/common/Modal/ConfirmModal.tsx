import React from "react";
import Modal, {
	IModalBodyProps,
	IModalRootProps,
	IModalTitleProps,
} from "./Modal";
import Button, { TButtonColor } from "../Button";

interface IConfirmModalRootProps extends IModalRootProps {
	okButtonColor?: TButtonColor;
	okButtonLabel?: React.ReactNode;
	cancelButtonLabel?: React.ReactNode;
	onAccept?: () => void;
}

type TConfirmModalComponent = React.FC<IConfirmModalRootProps> & {
	Title: React.FC<IModalTitleProps>;
	Body: React.FC<IModalBodyProps>;
};

const ConfirmModalRoot: React.FC<IConfirmModalRootProps> = ({
	okButtonColor = "action",
	okButtonLabel = "확인",
	cancelButtonLabel = "취소",
	onAccept,
	children,
	...baseModalProps
}) => {
	return (
		<Modal {...baseModalProps}>
			{children}

			<Modal.Footer>
				<Button
					color="neutral"
					variant="text"
					onClick={baseModalProps.onClose}
				>
					{cancelButtonLabel}
				</Button>

				<Button
					color={okButtonColor}
					onClick={onAccept}
				>
					{okButtonLabel}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

const ConfirmModal = ConfirmModalRoot as TConfirmModalComponent;
ConfirmModal.Title = Modal.Title;
ConfirmModal.Body = Modal.Body;

export default ConfirmModal;
