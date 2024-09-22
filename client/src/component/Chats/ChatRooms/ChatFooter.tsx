import { TbMessage2Search } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import { BsWechat } from "react-icons/bs";
import { ChatAsideCategory, useChatAside } from "../../../state/ChatAsideStore";

const ChatFooter = () => {
	const { category, setCategory } = useChatAside();
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(3, auto)",
				cursor: "pointer",
				width: "100%",
				height: "40px",
			}}
		>
			<div
				style={{
					cursor: "pointer",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}
				onClick={() => {
					setCategory(ChatAsideCategory.SEARCH);
				}}
			>
				<TbMessage2Search
					style={{
						color:
							category === ChatAsideCategory.SEARCH
								? "white"
								: "gray",
						width: "30px",
						height: "30px",
					}}
				/>
				<div
					style={{
						color:
							category === ChatAsideCategory.SEARCH
								? "white"
								: "gray",
					}}
				>
					검색
				</div>
			</div>
			<div
				style={{
					cursor: "pointer",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}
				onClick={() => {
					setCategory(ChatAsideCategory.MYROOM);
				}}
			>
				<BsWechat
					style={{
						color:
							category === ChatAsideCategory.MYROOM
								? "white"
								: "gray",
						width: "30px",
						height: "30px",
					}}
				/>
				<div
					style={{
						color:
							category === ChatAsideCategory.MYROOM
								? "white"
								: "gray",
					}}
				>
					채팅
				</div>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}
				onClick={() => {
					setCategory(ChatAsideCategory.SETTING);
				}}
			>
				<IoMdSettings
					style={{
						color:
							category === ChatAsideCategory.SETTING
								? "white"
								: "gray",
						width: "30px",
						height: "30px",
					}}
				/>
				<div
					style={{
						color:
							category === ChatAsideCategory.SETTING
								? "white"
								: "gray",
					}}
				>
					설정
				</div>
			</div>
		</div>
	);
};

export default ChatFooter;
