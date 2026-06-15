import type { WorkflowNodeMetadata } from "@/components/workflows/types";

export const metadata: WorkflowNodeMetadata = {
	nodeId: "http-request",
	label: "HTTP Request",
	category: "transform",
	description: "Calls an external endpoint and forwards the response.",
	defaultConfig: { method: "GET", url: "https://api.example.com" },
};
