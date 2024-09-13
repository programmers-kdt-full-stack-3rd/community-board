import { registerAs } from "@nestjs/config";

export default registerAs("auth", () => ({
	google: {
		client_id: process.env.OAUTH_GOOGLE_CLIENT_ID || "",
		client_secret: process.env.OAUTH_GOOGLE_CLIENT_SECRET || "",
	},
	kakao: {
		client_id: process.env.OAUTH_KAKAO_CLIENT_ID || "",
		client_secret: process.env.OAUTH_KAKAO_CLIENT_SECRET || "",
	},
	naver: {
		client_id: process.env.OAUTH_NAVER_CLIENT_ID || "",
		client_secret: process.env.OAUTH_NAVER_CLIENT_SECRET || "",
	},
}));
