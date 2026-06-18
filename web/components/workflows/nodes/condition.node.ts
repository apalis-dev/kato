import type { WorkflowNodeMetadata } from "@/components/workflows/types";
import { ConditionPropertyPanel } from "@/components/workflows/nodes/property-panels/condition-property-panel";

export const metadata: WorkflowNodeMetadata = {
	nodeId: "condition",
	label: "Condition",
	category: "action",
	description: "Branches execution based on a simple expression.",
	defaultConfig: { expression: "payload.ok === true" },
	inputs: 1,
	outputs: 1,
	propertyPanel: ConditionPropertyPanel,
};
