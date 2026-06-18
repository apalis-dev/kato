import type { WorkflowNodeMetadata } from "@/components/workflows/types";
import { WebhookResponsePropertyPanel } from "@/components/workflows/nodes/property-panels/webhook-response-property-panel";

export const metadata: WorkflowNodeMetadata = {
	nodeId: "webhook-response",
	label: "Webhook Response",
	category: "action",
	description: "Returns the final payload to the caller.",
	defaultConfig: { status: 200 },
	inputs: 1,
	outputs: 0,
	propertyPanel: WebhookResponsePropertyPanel,
};
