import React from "react";
import { IUserLog } from "shared";
import { dateToStr } from "../../../utils/date-to-str";

interface Props {
	log: IUserLog;
}

const AdminUserLogItem: React.FC<Props> = ({ log }) => {
	return (
		<div className="ml-2 grid grid-cols-[3fr_1fr_1fr] font-bold">
			<div>{log.title}</div>
			<div>{log.category}</div>
			<div>{dateToStr(new Date(log.createdAt), true)}</div>
		</div>
	);
};

export default AdminUserLogItem;
