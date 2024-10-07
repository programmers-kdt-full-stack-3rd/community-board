import { ChangeEvent, useRef, useState } from "react";

import Button from "../../component/common/Button";

import { LiaPenSolid } from "react-icons/lia";
import ProfileItem from "../../component/Profile/ProfileItem";

import TextInput from "../../component/common/TextInput";
import { useUserStore } from "../../state/store";
import { ApiCall } from "../../api/api";
import { uploadImageRequest } from "../../api/posts/crud";
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";
import { ClientError } from "../../api/errors";
import { sendPostCheckNicknameRequest } from "../../api/users/crud";

const ProfilePage = () => {
	const globalErrorModal = useGlobalErrorModal();
	const { nickname, email, imgUrl } = useUserStore();
	// const { setImgUrl, setNickName } = useUserStore.use.actions();
	const imageInputRef = useRef<HTMLInputElement>(null);

	const [newNickname, setNewNickname] = useState<string>(nickname);
	const [newImgUrl, setNewImgUrl] = useState<string>(imgUrl);
	const [isValid, setIsValid] = useState<boolean>(false);

	const [profileEdit, setProfileEdit] = useState<boolean>(false);

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

		const res = await ApiCall(
			() => sendPostCheckNicknameRequest({ nickname: newNickname }),
			err =>
				globalErrorModal.openWithMessageSplit({
					messageWithTitle: err.message,
				})
		);

		if (res instanceof ClientError) {
			return;
		}

		if (res.isDuplicated) {
			globalErrorModal.openWithMessageSplit({
				messageWithTitle: "닉네임 중복!",
			});
		}

		setIsValid(!res.isDuplicated);
	};

	// const updateProfile = async () => {

	// };

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
							className="width-100% bg-blue-900"
							size="medium"
							color="action"
							onClick={() => {
								// 닉네임 중복인지 check
								// userInfo 수정 요청
							}}
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
				>
					탈퇴하기
				</Button>
			</ProfileItem>
		</div>
	);
};

export default ProfilePage;
