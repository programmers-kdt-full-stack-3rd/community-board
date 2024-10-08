import * as dotenv from "dotenv";

dotenv.config();

export const adminAccountEnv = {
	ADMIN_ACCOUNT: process.env.ADMIN_ACCOUNT,
	ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};
