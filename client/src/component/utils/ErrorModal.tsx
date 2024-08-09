import {
	Background,
	Btn,
	CheckBtn,
	ErrorModalContainer,
	ErrorModalText,
	ErrorModalTitle,
} from "./ErrorModal.css";

interface ErrorModalProps {
	message: string;
	close: () => void;
	onError?: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, close, onError }) => {
	const [title, msg] = message.split(":");

	return (
		<div>
			<div className={Background} />
			<div className={ErrorModalContainer}>
				<div className={ErrorModalTitle}>{title}</div>
				<div className={ErrorModalText}>{msg}</div>
				<div className={Btn}>
					<button
						className={CheckBtn}
						onClick={() => {
							if (onError) {
								onError();
							}

							close();
						}}
					>
						확인
					</button>
				</div>
			</div>
		</div>
	);
};

export default ErrorModal;
