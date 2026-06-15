import type { WorkflowNodeMetadata } from "@/components/workflows/types";

export const metadata: WorkflowNodeMetadata = {
	nodeId: "manual-trigger",
	label: "Manual Trigger",
	category: "trigger",
	description: "Starts the workflow from an explicit run request.",
	defaultConfig: { event: "manual" },
};
