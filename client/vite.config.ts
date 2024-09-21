import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(env => {
	const isDevMode = env.mode === "development";

	const baseConfig: UserConfig = {
		envDir: "./../",

		plugins: [react(), vanillaExtractPlugin()],
	};

	if (isDevMode) {
		return {
			...baseConfig,

			build: {
				chunkSizeWarningLimit: 8000,
				minify: false,
			},
		};
	}

	return {
		...baseConfig,
	};
});
