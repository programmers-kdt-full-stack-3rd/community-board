import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import dotenv from "dotenv";

// .env 파일 로드
dotenv.config({ path: "./../.env" });

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), vanillaExtractPlugin()],

	build: {
		chunkSizeWarningLimit:
			process.env.NODE_ENV === "development" ? 2000 : undefined,
	},

	define: {
		"process.env": process.env,
	},
});
