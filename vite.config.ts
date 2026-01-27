import build from "@hono/vite-build/cloudflare-workers";
import adapter from "@hono/vite-dev-server/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import honox from "honox/vite";
import MagicString from "magic-string";
import { defineConfig, type Plugin } from "vite";

function removeDataTestId(): Plugin {
	const pattern = /\s*data-testid="[^"]*"/g;
	const isProduction = process.env.STRIP_TEST_IDS === "true";
	return {
		name: "remove-data-testid",
		apply: "build",
		transform(code, id) {
			if (!isProduction) {
				return null;
			}
			if (!id.endsWith(".tsx") && !id.endsWith(".jsx")) {
				return null;
			}
			if (!pattern.test(code)) {
				return null;
			}
			pattern.lastIndex = 0;
			const s = new MagicString(code);
			const matches = code.matchAll(pattern);
			for (const match of matches) {
				if (match.index !== undefined) {
					s.remove(match.index, match.index + match[0].length);
				}
			}
			return {
				code: s.toString(),
				map: s.generateMap({ hires: true }),
			};
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
