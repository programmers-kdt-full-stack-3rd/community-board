import { FaSearch, FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const ChatHeader = () => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(3, auto)",
			}}
		>
			<div
				style={{
					border: "1px solid white",
				}}
			>
				<FaSearch />
			</div>
			<div
				style={{
					border: "1px solid white",
				}}
			>
				<FaUser />
			</div>
			<div
				style={{
					border: "1px solid white",
				}}
			>
				<IoMdSettings />
			</div>
		</div>
	);
};

export default ChatHeader;
