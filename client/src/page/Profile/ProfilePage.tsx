import { ChangeEvent, useEffect, useRef, useState } from "react";

import Button from "../../component/common/Button";

import { LiaPenSolid } from "react-icons/lia";
import ProfileItem from "../../component/Profile/ProfileItem";

import TextInput from "../../component/common/TextInput";
import { useUserStore } from "../../state/store";
import { ApiCall } from "../../api/api";
import { uploadImageRequest } from "../../api/posts/crud";
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";
import { useToast } from "../../state/ToastStore";
import { ClientError } from "../../api/errors";
import {
	sendPatchProfileRequest,
	sendPostCheckUserRequest,
} from "../../api/users/crud";
import ConfirmModal from "../../component/common/Modal/ConfirmModal";
import { useModal } from "../../hook/useModal";
import { useNavigate } from "react-router-dom";
import PasswordUpdateModal from "../../component/Profile/Modal/PasswordUpdateModal";
import { fetchCouponName } from "../../api/coupon/coupon_crud";

const ProfilePage = () => {
	const navigate = useNavigate();
	const accountDeleteModal = useModal();
	const globalErrorModal = useGlobalErrorModal();
	const toast = useToast();
	const { nickname, email, imgUrl } = useUserStore();
	const { setImgUrl, setNickName } = useUserStore.use.actions();
	const imageInputRef = useRef<HTMLInputElement>(null);

	const [newNickname, setNewNickname] = useState<string>(nickname);
	const [newImgUrl, setNewImgUrl] = useState<string>(imgUrl);
	const [isValid, setIsValid] = useState<boolean>(false);

	const [profileEdit, setProfileEdit] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [couponName, setCouponName] = useState("");

	const handleAccountDeleteTry = () => {
		accountDeleteModal.open();
	};

	const handleAccountDeleteAccept = () => {
		accountDeleteModal.close();
		navigate(`/checkPassword?next=accountDelete`);
	};

	useEffect(() => {
		const fetchCoupon = async () => {
			try {
				const data = await fetchCouponName();
				setCouponName(data.name);
			} catch (error) {
				setCouponName("");
			}
		};

		fetchCoupon();
	}, []);

	const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const res = await ApiCall(
				() => uploadImageRequest(files[0]),
				err =>
					globalErrorModal.openWithMessageSplit({
						messageWithTitle: err.message,
					})
			);

			if (res instanceof ClientError) {
				return;
			}

			setNewImgUrl(res.imgUrl);
		}
	};

	// useEffect(() => {}, [imageInputRef.current?.files![0]]);

	const renderProfileImage = () => {
		if (profileEdit) {
			return (
				<button
					style={{
						position: "relative",
						width: "100%",
						height: "100%",
						borderRadius: "50%",
						backgroundImage: `url(${newImgUrl})`,
						backgroundSize: "cover", // 이미지 크기 조정
						backgroundPosition: "center", // 이미지 중앙 정렬
					}}
					onClick={() => {
						imageInputRef.current?.click();
					}}
				>
					<LiaPenSolid className="absolute bottom-0 right-0 h-[35px] w-[35px] rounded-full border border-black bg-white p-[5px] text-black dark:border-none" />
					<input
						ref={imageInputRef}
						type="file"
						accept="image/*"
						onChange={handleFileUpload}
						style={{ display: "none" }}
					/>
				</button>
			);
		} else {
			return (
				<img
					src={imgUrl}
					style={{
						width: "100%",
						height: "100%",
						borderRadius: "50%",
						objectFit: "cover",
					}}
				/>
			);
		}
	};

	const checkNickname = async () => {
		if (nickname === newNickname) {
			globalErrorModal.openWithMessageSplit({
				messageWithTitle: "닉네임 중복!",
			});
		}

		sendPostCheckUserRequest({ nickname: newNickname }).then(res => {
			if (res.error !== "") {
				toast.add({
					message: "잠시 후 다시 시도해 주세요!",
					variant: "error",
				});
				return;
			}

			if (res.isDuplicated) {
				globalErrorModal.openWithMessageSplit({
					messageWithTitle: "닉네임 중복!",
				});
				return;
			}

			setIsValid(!res.isDuplicated);
		});
	};

	const updateProfile = async () => {
		sendPatchProfileRequest({
			nickname: nickname !== newNickname ? newNickname : "",
			imgUrl: imgUrl !== newImgUrl ? newImgUrl : "",
		}).then(res => {
			if (res.error !== "") {
				globalErrorModal.openWithMessageSplit({
					messageWithTitle: res.error,
				});
				return;
			}

			setImgUrl(newImgUrl);
			setNickName(newNickname);
			setProfileEdit(false);
		});
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				marginLeft: "40px",
				marginRight: "40px",
				marginTop: "10px",
				gap: "20px",
				width: "500px",
				height: "150px",
				boxSizing: "border-box",
			}}
		>
			{isOpen ? <PasswordUpdateModal close={setIsOpen} /> : ""}
			<ConfirmModal
				variant="warning"
				isOpen={accountDeleteModal.isOpen}
				okButtonColor="danger"
				okButtonLabel="계속 진행"
				onAccept={handleAccountDeleteAccept}
				onClose={accountDeleteModal.close}
			>
				<ConfirmModal.Title>회원 탈퇴 확인</ConfirmModal.Title>
				<ConfirmModal.Body>
					회원 탈퇴 절차를 진행할까요?
				</ConfirmModal.Body>
			</ConfirmModal>

			<ProfileItem
				title="프로필"
				showEditIcon={true}
				profileEdit={profileEdit}
				setProfileEdit={setProfileEdit}
			>
				<div
					style={{
						width: "100px",
						height: "100px",
						overflow: "hidden",
					}}
				>
					{renderProfileImage()}
				</div>
				{profileEdit ? (
					<div
						style={{
							display: "flex",
							width: "350px",
							flexDirection: "column",
							justifyContent: "center",
							gap: "10px",
						}}
					>
						<TextInput
							label={"닉네임"}
							value={newNickname}
							onChange={e => {
								setNewNickname(e.target.value);
								setIsValid(false);
							}}
							placeholder="닉네임 입력하기"
							actionButton={
								<Button
									className="bg-customGray"
									size="medium"
									color="neutral"
									onClick={() => {
										checkNickname();
									}}
									disabled={isValid}
								>
									중복 확인
								</Button>
							}
						/>
						<Button
							className="width-100% disabled:bg-customGray bg-blue-900"
							size="medium"
							color="action"
							onClick={() => {
								updateProfile();
							}}
							disabled={
								(nickname === newNickname &&
									imgUrl === newImgUrl) ||
								(nickname !== newNickname && !isValid)
							}
						>
							수정하기
						</Button>
					</div>
				) : (
					<div
						style={{
							display: "flex",
							width: "350px",
							flexDirection: "column",
							justifyContent: "center",
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "flex-start",
									alignContent: "center",
									padding: "10px",
									fontWeight: "bold",
								}}
							>
								닉네임
							</div>
							<div
								style={{
									display: "flex",
									justifyContent: "flex-start",
									alignContent: "center",
									padding: "10px",
								}}
							>
								{nickname}
							</div>
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "flex-start",
									alignContent: "center",
									padding: "10px",
									fontWeight: "bold",
								}}
							>
								이메일
							</div>
							<div
								style={{
									display: "flex",
									justifyContent: "flex-start",
									alignContent: "center",
									padding: "10px",
								}}
							>
								{email}
							</div>
						</div>
					</div>
				)}
			</ProfileItem>
			<ProfileItem
				title="비밀번호"
				profileEdit={profileEdit}
				setProfileEdit={setProfileEdit}
			>
				<div
					style={{
						fontWeight: "bolder",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					비밀번호 수정하기
				</div>
				<Button
					className="bg-blue-900"
					size="medium"
					color="action"
					onClick={() => {
						setIsOpen(true);
					}}
				>
					수정하기
				</Button>
			</ProfileItem>
			<ProfileItem
				title="회원탈퇴"
				profileEdit={profileEdit}
				setProfileEdit={setProfileEdit}
			>
				<div
					style={{
						fontWeight: "bolder",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						color: "red",
					}}
				>
					회원 탈퇴하기
				</div>
				<Button
					style={{
						backgroundColor: "red",
						color: "white",
						fontWeight: "bolder",
					}}
					onClick={handleAccountDeleteTry}
				>
					탈퇴하기
				</Button>
			</ProfileItem>

			<ProfileItem
				title="쿠폰함"
				profileEdit={profileEdit}
				setProfileEdit={setProfileEdit}
			>
				<div
					style={{
						fontWeight: "bolder",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						color: "black",
					}}
				>
					내가 받은 쿠폰
				</div>
				<div className="flex flex-row">
					<p className="text-xs">{couponName}</p>
				</div>
			</ProfileItem>
		</div>
	);
};

export default ProfilePage;
