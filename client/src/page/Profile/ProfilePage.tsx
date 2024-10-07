import {
	ChangeEvent,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

import { IUserProfile } from "shared";
import Button from "../../component/common/Button";

import { LiaPenSolid } from "react-icons/lia";
import ProfileItem from "../../component/Profile/ProfileItem";

import profileIcon from "../../assets/icons/profile-icon.svg";

const ProfilePage = () => {
	const [userInfo, setUserInfo] = useState<IUserProfile>();
	const imageInputRef = useRef<HTMLInputElement>(null);
	const [profileEdit, setProfileEdit] = useState<boolean>(false);

	const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			// TODO : 서버로 업로드하고 url 받기
			console.log("선택한 파일:", files[0]);
			setUserInfo({ ...userInfo! });
		}
	};

	useLayoutEffect(() => {
		// TODO : 프로필 가져오는 API 만들기
		setUserInfo({
			id: 1,
			email: "gkgk01420@naver.com",
			nickname: "헝컹이",
			imgSrc: "",
		});

		// TODO : 사용자 블로그, 사용자 기술 스택 정보 api (나중에)
	}, []);

	useEffect(() => {}, [imageInputRef.current?.files![0]]);

	const renderProfileImage = () => {
		const src = userInfo?.imgSrc ? userInfo?.imgSrc : profileIcon;

		if (profileEdit) {
			return (
				<button
					style={{
						position: "relative",
						width: "100%",
						height: "100%",
						borderRadius: "50%",
						backgroundImage: `url(${src})`,
						backgroundSize: "cover", // 이미지 크기 조정
						backgroundPosition: "center", // 이미지 중앙 정렬
					}}
					onClick={() => {
						imageInputRef.current?.click();
					}}
				>
					<LiaPenSolid
						style={{
							position: "absolute",
							bottom: "0px",
							right: "0px",
							width: "35px",
							height: "35px",
							borderRadius: "50%",
							backgroundColor: "white",
							color: "black",
							padding: "5px",
						}}
					/>
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
					src={src}
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
							name
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "flex-start",
								alignContent: "center",
								padding: "10px",
							}}
						>
							{userInfo?.nickname}
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
							email
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "flex-start",
								alignContent: "center",
								padding: "10px",
							}}
						>
							{userInfo?.email}
						</div>
					</div>
				</div>
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
				<Button>수정하기</Button>
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
