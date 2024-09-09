import { RowDataPacket } from "mysql2";
import { IOAuthConnection } from "./oauths";

export const mapDBToOAuthConnections = (
	rows: RowDataPacket[]
): IOAuthConnection[] => {
	return rows.map(row => ({
		id: row.id,
		user_id: row.user_id,
		oauth_provider_name: row.oauth_provider_name,
		oauth_account_id: row.oauth_account_id,
		oauth_refresh_token: row.oauth_refresh_token,
	}));
};
