import build from "@hono/vite-build/cloudflare-workers";
import adapter from "@hono/vite-dev-server/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import honox from "honox/vite";
import { defineConfig, type Plugin } from "vite";

function removeDataTestId(): Plugin {
	const jsPattern = /,?\s*"data-testid":\s*"[^"]*"/g;
	const isProduction = process.env.STRIP_TEST_IDS === "true";

	return {
		name: "remove-data-testid",
		apply: "build",
		renderChunk(code) {
			if (!isProduction) {
				return null;
			}
			if (!jsPattern.test(code)) {
				return null;
			}
			jsPattern.lastIndex = 0;
			return code.replace(jsPattern, "");
		},
	};
}

export default defineConfig({
	plugins: [
		honox({
			devServer: { adapter },
			client: { input: ["/app/client.ts", "/app/style.css"] },
		}),
		tailwindcss(),
		build(),
		removeDataTestId(),
	],
	ssr: {
		external: ["resend"],
	},
	resolve: {
		alias: {
			"@": `${process.cwd()}/app`,
		},
	},
	server: {
		host: true,
		watch: {
			usePolling: true,
			interval: 1000,
		},
	},
});
