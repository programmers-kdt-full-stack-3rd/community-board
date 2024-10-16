import React, { useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
	mapResponseToNonSensitiveUser,
	TOAuthLoginType,
	TOAuthProvider,
} from "shared";
import googleIcon from "../../assets/icons/google-icon.svg";
import naverIcon from "../../assets/icons/naver-icon.svg";
import kakaoIcon from "../../assets/icons/kakao-icon.svg";

import { deleteOAuthConnection, getOAuthLoginUrl } from "../../api/users/oauth";
import { ApiCall } from "../../api/api";
import { getUserMyself } from "../../api/users/crud";
import { useModal } from "../../hook/useModal";
import { useGlobalErrorModal } from "../../state/GlobalErrorModalStore";
import ConfirmModal from "../common/Modal/ConfirmModal";

interface IProps {
	loginType: TOAuthLoginType;
}

type TOAuthLinks = {
	[provider in TOAuthProvider]?: boolean | null | undefined;
};

const providerToName: { [provider in TOAuthProvider]: string } = {
	google: "구글",
	kakao: "카카오",
	naver: "네이버",
};

const OAuthLoginButtons: React.FC<IProps> = ({ loginType }) => {
	const [oAuthConnections, setOAuthConnections] =
		useState<TOAuthLinks | null>(null);

	const [unlinkTarget, setUnlinkTarget] = useState<TOAuthProvider | "">("");
	const unlinkConfirmModal = useModal();
	const globalErrorModal = useGlobalErrorModal();

	const location = useLocation();

	useLayoutEffect(() => {
		if (loginType !== "link") {
			return;
		}

		ApiCall(
			() => getUserMyself(),
			err => console.error("유저 정보 조회 실패", err)
		).then(response => {
			if (response instanceof Error) {
				return;
			}

			const user = mapResponseToNonSensitiveUser(response);

			const connection = user.connected_oauth.reduce<TOAuthLinks>(
				(acc, provider) => {
					acc[provider] = true;
					return acc;
				},
				{}
			);

			setOAuthConnections(connection);
		});
	}, [loginType]);

	const handleLoginClickWith = (provider: TOAuthProvider) => async () => {
		const response = await ApiCall(
			() => getOAuthLoginUrl(loginType, provider),
			err => {
				console.error(`${provider} 로그인 URL 조회 에러`, err);
				globalErrorModal.open({
					title: "오류",
					message: `${provider}(으)로 로그인할 수 없습니다.`,
				});
			}
		);

		if (response instanceof Error || typeof response.url !== "string") {
			return;
		}

		sessionStorage.setItem("oauth_prev_pathname", location.pathname);
		sessionStorage.setItem("oauth_prev_search", location.search);

		window.location.href = response.url;
	};

	const handleUnlinkClickWith = (provider: TOAuthProvider) => () => {
		setUnlinkTarget(provider);
		unlinkConfirmModal.open();
	};

	const handleUnlinkAccept = async () => {
		const provider = unlinkTarget;

		if (provider === "") {
			return;
		}

		const response = await ApiCall(
			() => deleteOAuthConnection(provider),
			err => {
				console.error(`${provider} 로그인 연동 해제 실패`, err);
				globalErrorModal.open({
					title: "소셜 로그인 연동 해제 실패",
					message: `${providerToName[provider]} 로그인 연동 해제에 실패했습니다.`,
				});
			}
		);

		if (response instanceof Error) {
			return;
		}

		setOAuthConnections({
			...oAuthConnections,
			[provider]: false,
		});

		unlinkConfirmModal.close();
		globalErrorModal.open({
			variant: "info",
			title: "소셜 로그인 연동 해제 성공",
			message: `${providerToName[provider]} 로그인 연동을 해제했습니다.`,
		});
	};

	return (
		<div className="mt-5 flex w-full flex-col gap-4">
			<ConfirmModal
				isOpen={unlinkConfirmModal.isOpen}
				okButtonColor="danger"
				okButtonLabel="연동 해제"
				onAccept={handleUnlinkAccept}
				onClose={unlinkConfirmModal.close}
			>
				<ConfirmModal.Title>
					소셜 로그인 연동 해제 확인
				</ConfirmModal.Title>
				<ConfirmModal.Body>
					{unlinkTarget && providerToName[unlinkTarget]} 로그인 연동을
					해제할까요?
				</ConfirmModal.Body>
			</ConfirmModal>

			<div className="flex items-stretch justify-stretch gap-4">
				<button
					className="flex flex-grow cursor-pointer items-center justify-center rounded-lg border-none bg-white p-3 text-base font-bold text-black transition-transform duration-200 hover:bg-gray-100 hover:text-gray-800 hover:shadow-lg hover:shadow-gray-400/50"
					disabled={oAuthConnections?.google ?? false}
					onClick={handleLoginClickWith("google")}
				>
					<img
						src={googleIcon}
						alt="Google Icon"
						className="mr-2 h-5 w-5"
					/>
					구글로 로그인
				</button>

				{loginType === "link" ? (
					<button
						disabled={!oAuthConnections?.google}
						onClick={handleUnlinkClickWith("google")}
					>
						연동 해제
					</button>
				) : null}
			</div>

			<div className="flex items-stretch justify-stretch gap-4">
				<button
					className="flex flex-grow cursor-pointer items-center justify-center rounded-lg border-none bg-[#1ec800] p-3 text-base font-bold text-white transition-transform duration-200 hover:bg-[#17a500] hover:text-gray-300 hover:shadow-lg hover:shadow-black/50"
					disabled={oAuthConnections?.naver ?? false}
					onClick={handleLoginClickWith("naver")}
				>
					<img
						src={naverIcon}
						alt="Naver Icon"
						className="mr-2 h-5 w-5"
					/>
					네이버로 로그인
				</button>

				{loginType === "link" ? (
					<button
						disabled={!oAuthConnections?.naver}
						onClick={handleUnlinkClickWith("naver")}
					>
						연동 해제
					</button>
				) : null}
			</div>

			<div className="flex items-stretch justify-stretch gap-4">
				<button
					className="flex flex-grow cursor-pointer items-center justify-center rounded-lg border-none bg-[#fee500] p-3 text-base font-bold text-black transition-transform duration-200 hover:bg-[#fdd835] hover:text-[#2e1b1b] hover:shadow-lg hover:shadow-black/50"
					disabled={oAuthConnections?.kakao ?? false}
					onClick={handleLoginClickWith("kakao")}
				>
					<img
						src={kakaoIcon}
						alt="Kakao Icon"
						className="mr-2 h-5 w-5"
					/>
					카카오로 로그인
				</button>

				{loginType === "link" ? (
					<button
						disabled={!oAuthConnections?.kakao}
						onClick={handleUnlinkClickWith("kakao")}
					>
						연동 해제
					</button>
				) : null}
			</div>
		</div>
	);
};

export default OAuthLoginButtons;
