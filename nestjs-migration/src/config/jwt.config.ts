import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => ({
	private_key: process.env.PRIVATE_KEY || "",
	access_token_key: process.env.ACCESS_TOKEN_KEY || "",
	refresh_token_key: process.env.REFRESH_TOKEN_KEY || "",
	temp_token_key: process.env.TEMP_TOKEN_KEY || "",
}));
