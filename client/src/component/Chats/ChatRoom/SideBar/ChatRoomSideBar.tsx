import React from "react";
import { IRoomMember } from "shared";
import profileIcon from "../../../../assets/icons/profile-icon.svg";
import { Link } from "react-router-dom";
import { useChatAside } from "../../../../state/ChatAsideStore";
import { FiX } from "react-icons/fi";
import { useToast } from "../../../../state/ToastStore";
import { ApiCall } from "../../../../api/api";
import { sendLeaveRoomRequest } from "../../../../api/chats/crud";
import { ClientError } from "../../../../api/errors";

interface Props {
	title: string;
	sideBarClose: () => void;
	members: IRoomMember[];
	roomId: number;
	myMemberId: number;
	goBack: () => void;
}

export const ChatRoomSideBar: React.FC<Props> = ({
	title,
	sideBarClose,
	members,
	roomId,
	myMemberId,
	goBack,
}) => {
	const toast = useToast();
	const { close } = useChatAside();

	const renderMembers = () => {
		return members.map(member => (
			<div
				className="flex-start flex h-[50px] w-[310px]"
				key={member.memberId}
			>
				<div className="flex h-full w-full flex-row gap-[10px] pl-[10px]">
					<div className="flex items-center">
						<img
							className="h-[30px] w-[30px] rounded-full object-cover"
							src={member.imgUrl ? member.imgUrl : profileIcon}
						/>
					</div>

					<div className="flex items-center justify-start font-extrabold">
						{member.nickname}
					</div>
				</div>
			</div>
		));
	};

	const handleLeaveRoom = async () => {
		members.forEach(member => {
			if (member.memberId === myMemberId && member.isHost === true) {
				toast.add({
					message: "방장은 탈퇴할 수 없습니다.",
					variant: "error",
				});
				return;
			}
		});

		/*
            roomId, memberId -> roomId, myMemberId, user_id 일치하는 user 삭제
            방장이면 삭제 x

            나가기 성공 -> 채팅방 aside에서 이전 페이지로 감
        */

		const result = await ApiCall(
			() => sendLeaveRoomRequest(roomId),
			() => {}
		);

		if (result instanceof ClientError) {
			return;
		}

		goBack();
	};

	return (
		<>
			<div
				className="absolute right-[-15px] top-[-20px] z-10 h-[500px] w-[400px] bg-black bg-opacity-50"
				onClick={sideBarClose}
			></div>
			<div className="bg-customGray absolute right-[-15px] top-[-20px] z-20 flex h-[500px] w-[350px] flex-col gap-[10px] px-[20px] py-[10px]">
				<div className="flex h-[50px] w-[310px] items-center justify-between py-[10px] pl-[10px]">
					<div className="font-extrabold">{title}</div>
					<div
						onClick={() => {
							/* TODO : 타이틀 수정 */
							console.log(roomId);
							console.log(members);
						}}
					>
						<FiX
							className="h-[25px] w-[25px] cursor-pointer"
							onClick={sideBarClose}
						/>
					</div>
				</div>
				<div className="h-auto w-[310px]">
					<div className="flex items-center justify-start py-[10px] pl-[10px] font-extrabold">
						멤버
					</div>
					<div className="flex h-[250px] w-[310px] flex-col gap-[10px] overflow-x-hidden overflow-y-scroll">
						{renderMembers()}
					</div>
				</div>
				<Link
					to={`/post/new?category_id=4&room_id=${roomId}`}
					onClick={close}
					className="flex h-[50px] w-[310px] cursor-pointer items-center justify-center bg-blue-500 font-extrabold text-white"
				>
					모집글 작성
				</Link>
				<div
					className="flex h-[50px] w-[310px] cursor-pointer items-center justify-center bg-red-500 font-extrabold text-white"
					onClick={handleLeaveRoom}
				>
					방 나가기
				</div>
			</div>
		</>
	);
};
