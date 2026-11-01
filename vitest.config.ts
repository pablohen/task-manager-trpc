import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
	},
	test: {
		environment: "node",
		coverage: {
			provider: "v8",
			// The unit tests cover the backend; the UI is checked in the browser.
			include: ["src/server/**/*.ts"],
			reporter: ["text", "html"],
		},
	},
});
