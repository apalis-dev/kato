import type { WorkflowNodeMetadata } from "@/components/workflows/types";
import { HttpRequestPropertyPanel } from "@/components/workflows/nodes/property-panels/http-request-property-panel";

export const metadata: WorkflowNodeMetadata = {
	nodeId: "http-request",
	label: "HTTP Request",
	category: "action",
	description: "Calls an external endpoint and forwards the response.",
	defaultConfig: { method: "GET", url: "https://api.example.com" },
	inputs: 1,
	outputs: 1,
	propertyPanel: HttpRequestPropertyPanel,
};
