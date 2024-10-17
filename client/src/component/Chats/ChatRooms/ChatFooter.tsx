import { TbMessage2Search } from "react-icons/tb";
import { BsWechat } from "react-icons/bs";
import { ChatAsideCategory, useChatAside } from "../../../state/ChatAsideStore";
import {
	chatCategoryStyle,
	chatFooterStyle,
	chatIconStyle,
	chatIconTextStyle,
} from "./ChatRooms.css";

const ChatFooter = () => {
	const { category, setCategory } = useChatAside();
	return (
		<div className={chatFooterStyle}>
			<div
				className={chatCategoryStyle}
				onClick={() => {
					setCategory(ChatAsideCategory.SEARCH);
				}}
			>
				<TbMessage2Search
					className={
						chatIconStyle[
							ChatAsideCategory.SEARCH === category
								? "active"
								: "inactive"
						]
					}
				/>
				<div
					className={
						chatIconTextStyle[
							ChatAsideCategory.SEARCH === category
								? "active"
								: "inactive"
						]
					}
				>
					검색
				</div>
			</div>
			<div
				className={chatCategoryStyle}
				onClick={() => {
					setCategory(ChatAsideCategory.MYROOM);
				}}
			>
				<BsWechat
					className={
						chatIconStyle[
							ChatAsideCategory.MYROOM === category
								? "active"
								: "inactive"
						]
					}
				/>
				<div
					className={
						chatIconTextStyle[
							ChatAsideCategory.MYROOM === category
								? "active"
								: "inactive"
						]
					}
				>
					채팅
				</div>
			</div>
		</div>
	);
};

export default ChatFooter;
