import type { WorkflowNodeMetadata } from "@/components/workflows/types";

export const metadata: WorkflowNodeMetadata = {
	nodeId: "webhook-response",
	label: "Webhook Response",
	category: "output",
	description: "Returns the final payload to the caller.",
	defaultConfig: { status: 200 },
};
