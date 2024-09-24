import { onlineUserItem } from "./OnlineUserItem.css";

interface OnlineUserItemProps {
	nickname: string;
}

const OnlineUserItem: React.FC<OnlineUserItemProps> = ({ nickname }) => {
	return (
		<div className={onlineUserItem}>
			<span>{nickname}</span>
		</div>
	);
};

export default OnlineUserItem;
