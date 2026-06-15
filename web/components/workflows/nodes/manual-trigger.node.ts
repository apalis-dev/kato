import type { WorkflowNodeMetadata } from "@/components/workflows/types";
import { ManualTriggerPropertyPanel } from "@/components/workflows/nodes/property-panels/manual-trigger-property-panel";

export const metadata: WorkflowNodeMetadata = {
	nodeId: "manual-trigger",
	label: "Manual Trigger",
	category: "trigger",
	description: "Starts the workflow from an explicit run request.",
	defaultConfig: { event: "manual" },
	propertyPanel: ManualTriggerPropertyPanel,
};
