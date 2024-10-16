import React from "react";
import { IRoomMember } from "shared";
import { LiaPenSolid } from "react-icons/lia";
import profileIcon from "../../../../assets/icons/profile-icon.svg";
import { Link } from "react-router-dom";

interface Props {
	title: string;
	close: () => void;
	members: IRoomMember[];
	roomId: number;
}

export const ChatRoomSideBar: React.FC<Props> = ({
	title,
	close,
	members,
	roomId,
}) => {
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

	return (
		<>
			<div
				className="absolute right-[-15px] top-[-20px] z-10 h-[500px] w-[400px] bg-black bg-opacity-50"
				onClick={close}
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
						<LiaPenSolid className="h-[25px] w-[25px]" />
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
				<div
					className="flex h-[50px] w-[310px] cursor-pointer items-center justify-center bg-blue-500 font-extrabold text-white"
					onClick={() => {
						/* TODO : 모집글 작성 */
					}}
				>
					모집글 작성
				</div>
				<Link
					to={`/post/new?category_id=4&room_id=${roomId}`}
					className="flex h-[50px] w-[310px] cursor-pointer items-center justify-center bg-red-500 font-extrabold text-white"
				>
					방 나가기
				</Link>
				{/* <div
					className="flex h-[50px] w-[310px] cursor-pointer items-center justify-center bg-red-500 font-extrabold text-white"
					onClick={() => {}}
				>
					방 나가기
				</div> */}
			</div>
		</>
	);
};