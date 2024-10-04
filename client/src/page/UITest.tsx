import React, { useState } from "react";
import Button from "../component/common/Button";
import Textarea from "../component/common/Textarea";
import TextInput from "../component/common/TextInput";
import Modal from "../component/common/Modal/Modal";
import AlertModal from "../component/common/Modal/AlertModal";
import ConfirmModal from "../component/common/Modal/ConfirmModal";
import { useModal } from "../hook/useModal";

const sampleText = `본 카드는 한국에서만 사용 가능합니다.
1. 본 카드는 현금과 동일하게 사용할 수 있습니다.
2. 본 카드는 재충전이 가능하며, 현금과 교환되지 않습니다.
3. 본 카드는 구매하실 때 현금 영수증을 받으실 수 있습니다.
4. 본 카드의 도난, 분실 등에 대하여 당사는 책임지지 않습니다.
5. 국내 매장에서만 이용 가능합니다. (단, 일부 매장은 제외됩니다.)
6. 카드 충전금액의 유효기간은 최종 충전 또는 사용일로부터 5년입니다.
7. 본 카드는 최종 충전 후 합계 잔액 기준 60% 이상 사용하였을 경우에만 환불이 가능합니다.`;

const UITest = () => {
	const [email, setEmail] = useState("hello@example.com");
	const [nickname, setNickname] = useState("누가사용중");
	const [password, setPassword] = useState("Password!1");
	const [multilineText, setMultilineText] = useState(sampleText);

	const [lastModalAction, setLastModalAction] = useState("아직 동작 없음");
	const baseModal = useModal();
	const alertModal = useModal();
	const confirmModal = useModal();

	const handleButtonClickWith = (message: string) => () => {
		alert(message || "버튼 클릭");
	};

	const handleInputChangeWith =
		(setState: React.Dispatch<React.SetStateAction<string>>) =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setState(event.target.value);
		};

	return (
		<div className="flex w-96 flex-col gap-6 rounded-lg border border-neutral-500 p-6 pb-64">
			<AlertModal
				isOpen={alertModal.isOpen}
				variant="info"
				okButtonLabel="돌아가기"
				onClose={() => {
					alertModal.close();
					setLastModalAction("AlertModal 닫기 (onClose)");
				}}
			>
				<AlertModal.Title>안내</AlertModal.Title>

				<AlertModal.Body>
					1. 본 카드는 현금과 동일하게 사용할 수 있습니다.
				</AlertModal.Body>
			</AlertModal>

			<ConfirmModal
				isOpen={confirmModal.isOpen}
				variant="warning"
				okButtonLabel="동의"
				cancelButtonLabel="거절"
				onAccept={() => {
					confirmModal.close();
					setLastModalAction("ConfirmModal 승인 (onAccept)");
				}}
				onClose={() => {
					confirmModal.close();
					setLastModalAction("ConfirmModal 취소 (onClose)");
				}}
			>
				<ConfirmModal.Title>경고</ConfirmModal.Title>

				<ConfirmModal.Body>
					2. 본 카드는 재충전이 가능하며, 현금과 교환되지 않습니다.
				</ConfirmModal.Body>
			</ConfirmModal>

			<Modal
				isOpen={baseModal.isOpen}
				variant="error"
				onClose={() => {
					baseModal.close();
					setLastModalAction("Modal 닫기 (onClose)");
				}}
			>
				<Modal.Title>오류</Modal.Title>

				<Modal.Body>
					3. 본 카드는 구매하실 때 현금 영수증을 받으실 수 있습니다.
					<br />
					4. 본 카드의 도난, 분실 등에 대하여 당사는 책임지지
					않습니다.
				</Modal.Body>

				<Modal.Footer>
					<Button
						color="action"
						variant="outline"
						onClick={() => {
							alertModal.open();
							setLastModalAction("Modal에서 AlertModal 열기");
						}}
					>
						자세히 보기
					</Button>

					<Button
						color="action"
						variant="outline"
						onClick={() => {
							confirmModal.open();
							setLastModalAction("Modal에서 ConfirmModal 열기");
						}}
					>
						오류 제보
					</Button>

					<Button
						color="action"
						onClick={() => {
							baseModal.close();
							setLastModalAction(
								"Modal 닫기 (Footer에 넣은 버튼 클릭)"
							);
						}}
					>
						닫기
					</Button>
				</Modal.Footer>
			</Modal>

			<div className="fixed left-8 top-24 z-[100] rounded-lg bg-neutral-100 p-4 text-left font-bold shadow-md dark:border-0 dark:bg-neutral-700 dark:shadow-none">
				<div>마지막 모달 동작:</div>
				<div className="text-blue-700 dark:text-blue-300">
					{lastModalAction}
				</div>
			</div>

			<Button
				color="neutral"
				onClick={() => {
					baseModal.open();
					setLastModalAction("Modal 열기");
				}}
			>
				Modal
			</Button>

			<div className="flex w-full items-start gap-4">
				<Button
					className="flex-auto basis-full"
					onClick={() => {
						alertModal.open();
						setLastModalAction("AlertModal 열기");
					}}
				>
					AlertModal
				</Button>

				<Button
					className="flex-auto basis-full"
					onClick={() => {
						confirmModal.open();
						setLastModalAction("ConfirmModal 열기");
					}}
				>
					ConfirmModal
				</Button>
			</div>

			<Button
				onClick={async () => {
					setLastModalAction("모달 3개 열기");
					await Promise.resolve(baseModal.open());
					await Promise.resolve(alertModal.open());
					await Promise.resolve(confirmModal.open());
				}}
			>
				<div>모달 여러 개 열기</div>
				<div className="text-left opacity-60">
					1. Modal
					<br />
					2. AlertModal
					<br />
					3. ConfirmModal
				</div>
			</Button>

			<hr className="h-px w-full border-0 bg-neutral-500" />

			<h2 style={{ margin: "0" }}>버튼 컴포넌트</h2>

			<div className="flex items-start gap-4">
				<Button
					color="primary"
					variant="solid"
					onClick={handleButtonClickWith('variant="solid"')}
				>
					채우기
				</Button>
				<Button
					color="primary"
					variant="outline"
					onClick={handleButtonClickWith('variant="outline"')}
				>
					라인
				</Button>
				<Button
					color="primary"
					variant="text"
					onClick={handleButtonClickWith('variant="text"')}
				>
					텍스트만
				</Button>
			</div>

			<div className="flex items-start gap-4">
				<Button
					size="large"
					color="primary"
					onClick={handleButtonClickWith('size="large"')}
				>
					큰 버튼
				</Button>
				<Button
					size="medium"
					color="primary"
					onClick={handleButtonClickWith('size="medium"')}
				>
					중간 버튼
				</Button>
				<Button
					size="small"
					color="primary"
					onClick={handleButtonClickWith('size="small"')}
				>
					작은 버튼
				</Button>
			</div>

			<div className="flex items-start gap-4">
				<Button
					size="medium"
					color="primary"
					onClick={handleButtonClickWith('color="primary"')}
				>
					메인
				</Button>
				<Button
					size="medium"
					color="action"
					onClick={handleButtonClickWith('color="action"')}
				>
					행동
				</Button>
				<Button
					size="medium"
					color="neutral"
					onClick={handleButtonClickWith('color="neutral"')}
				>
					중립
				</Button>
				<Button
					size="medium"
					color="danger"
					onClick={handleButtonClickWith('color="danger"')}
				>
					위험
				</Button>
			</div>

			<hr className="h-px w-full border-0 bg-neutral-500" />

			<h2 style={{ margin: "0" }}>텍스트 입력 컴포넌트</h2>

			<div className="flex items-start gap-4">
				<TextInput
					id="email"
					label="이메일"
					value={email}
					onChange={handleInputChangeWith(setEmail)}
					actionButton={
						<Button
							size="small"
							color="primary"
							onClick={handleButtonClickWith("이메일 중복 확인")}
						>
							중복 확인
						</Button>
					}
				/>
			</div>

			<div className="flex items-start gap-4">
				<TextInput
					id="nickname"
					label="닉네임"
					value={nickname}
					onChange={handleInputChangeWith(setNickname)}
					isValid={false}
					errorMessage="이미 사용 중인 닉네임입니다."
					actionButton={
						<Button
							size="small"
							color="primary"
							onClick={handleButtonClickWith("닉네임 중복 확인")}
						>
							중복 확인
						</Button>
					}
				/>
			</div>

			<div className="flex items-start gap-4">
				<TextInput
					id="password"
					type="password"
					label="비밀번호"
					value={password}
					onChange={handleInputChangeWith(setPassword)}
				/>
			</div>

			<div className="flex items-start gap-4">
				<Textarea
					value={multilineText}
					onChange={handleInputChangeWith(setMultilineText)}
				/>
			</div>
		</div>
	);
};

export default UITest;
