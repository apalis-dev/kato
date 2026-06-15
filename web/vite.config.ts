import { reactRouter } from "@react-router/dev/vite";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [reactRouter()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL(".", import.meta.url)),
		},
		dedupe: ["react", "react-dom"],
	},
	optimizeDeps: {
		include: ["react", "react-dom", "@xyflow/react"],
	},
});
