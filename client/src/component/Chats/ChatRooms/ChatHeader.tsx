import { FaSearch } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { BsWechat } from "react-icons/bs";
import { ChatAsideCategory, useChatAside } from "../../../state/ChatAsideStore";

const ChatHeader = () => {
	const { category, setCategory } = useChatAside();
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(3, auto)",
				cursor: "pointer",
			}}
		>
			<div
				style={{
					border: "1px solid white",
					backgroundColor:
						category === ChatAsideCategory.SEARCH ? "white" : "",
					cursor: "pointer",
				}}
				onClick={() => {
					setCategory(ChatAsideCategory.SEARCH);
				}}
			>
				<FaSearch
					style={{
						color:
							category === ChatAsideCategory.SEARCH
								? "black"
								: "white",
					}}
				/>
			</div>
			<div
				style={{
					border: "1px solid white",
					backgroundColor:
						category === ChatAsideCategory.MYROOM ? "white" : "",
					cursor: "pointer",
				}}
				onClick={() => {
					setCategory(ChatAsideCategory.MYROOM);
				}}
			>
				<BsWechat
					style={{
						color:
							category === ChatAsideCategory.MYROOM
								? "black"
								: "white",
					}}
				/>
			</div>
			<div
				style={{
					border: "1px solid white",
					backgroundColor:
						category === ChatAsideCategory.SETTING ? "white" : "",
				}}
				onClick={() => {
					setCategory(ChatAsideCategory.SETTING);
				}}
			>
				<IoMdSettings
					style={{
						color:
							category === ChatAsideCategory.SETTING
								? "black"
								: "white",
					}}
				/>
			</div>
		</div>
	);
};

export default ChatHeader;
