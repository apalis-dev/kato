import type { WorkflowNodeMetadata } from "@/components/workflows/types";

export const metadata: WorkflowNodeMetadata = {
	nodeId: "condition",
	label: "Condition",
	category: "transform",
	description: "Branches execution based on a simple expression.",
	defaultConfig: { expression: "payload.ok === true" },
};
