import { useLayoutEffect, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";
import { IUserProfile } from "shared";

const ProfilePage = () => {
	const [userInfo, setUserInfo] = useState<IUserProfile>();

	useLayoutEffect(() => {
		// TODO : 프로필 가져오는 API 만들기
		setUserInfo({
			id: 1,
			email: "gkgk01420@naver.com",
			nickname: "헝컹이",
			imgSrc: "",
			introduction: "코딩은 즐거워 히히호호히히",
		});

		// TODO : 사용자 블로그, 사용자 기술 스택 정보 api (나중에)
	}, []);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				marginLeft: "40px",
				marginRight: "40px",
				marginTop: "10px",
				gap: "20px",
				width: "50%",
				boxSizing: "border-box",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						width: "100%",
						paddingLeft: "10px",
						paddingRight: "10px",
						paddingBottom: "10px",
					}}
				>
					<div
						style={{
							fontWeight: "bolder",
						}}
					>
						프로필
					</div>
					<IoMdSettings
						style={{
							cursor: "pointer",
						}}
					/>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						width: "100%",
						padding: "10px",
						border: "1px solid #ddd",
						borderRadius: "10px",
						gap: "10px",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							width: "30%",
						}}
					>
						{userInfo?.imgSrc ? (
							<img
								src={userInfo?.imgSrc}
								style={{
									width: "100%",
									height: "100%",
									borderRadius: "50%",
								}}
							/>
						) : (
							<IoPersonCircle
								style={{
									width: "100%",
									height: "100%",
									borderRadius: "50%",
								}}
							/>
						)}
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "60%",
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
								자기 소개
							</div>
							<div
								style={{
									display: "flex",
									justifyContent: "flex-start",
									alignContent: "center",
									padding: "10px",
								}}
							>
								{userInfo?.introduction}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
