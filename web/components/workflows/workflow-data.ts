import type {
	WorkflowEdge,
	WorkflowNode,
	WorkflowNodeCategory,
	WorkflowNodeData,
} from "@/components/workflows/types";

export type WorkflowNodeDefinition = {
	nodeId: string;
	label: string;
	category: WorkflowNodeCategory;
	description: string;
	defaultConfig: Record<string, unknown>;
};

export const workflowNodeDefinitions: WorkflowNodeDefinition[] = [
	{
		nodeId: "manual-trigger",
		label: "Manual Trigger",
		category: "trigger",
		description: "Starts the workflow from an explicit run request.",
		defaultConfig: { event: "manual" },
	},
	{
		nodeId: "http-request",
		label: "HTTP Request",
		category: "transform",
		description: "Calls an external endpoint and forwards the response.",
		defaultConfig: { method: "GET", url: "https://api.example.com" },
	},
	{
		nodeId: "condition",
		label: "Condition",
		category: "transform",
		description: "Branches execution based on a simple expression.",
		defaultConfig: { expression: "payload.ok === true" },
	},
	{
		nodeId: "webhook-response",
		label: "Webhook Response",
		category: "output",
		description: "Returns the final payload to the caller.",
		defaultConfig: { status: 200 },
	},
];

export function createWorkflowNodeData(
	definition: WorkflowNodeDefinition,
	overrides: Partial<WorkflowNodeData> = {},
): WorkflowNodeData {
	return {
		label: definition.label,
		nodeId: definition.nodeId,
		category: definition.category,
		description: definition.description,
		config: definition.defaultConfig,
		deletable: true,
		...overrides,
	};
}

export const initialWorkflowNodes: WorkflowNode[] = [
	{
		id: "node-trigger",
		type: "workflow",
		position: { x: 0, y: 80 },
		data: createWorkflowNodeData(workflowNodeDefinitions[0], {
			deletable: false,
		}),
	},
	{
		id: "node-http",
		type: "workflow",
		position: { x: 340, y: 10 },
		data: createWorkflowNodeData(workflowNodeDefinitions[1]),
	},
	{
		id: "node-condition",
		type: "workflow",
		position: { x: 340, y: 190 },
		data: createWorkflowNodeData(workflowNodeDefinitions[2]),
	},
	{
		id: "node-output",
		type: "workflow",
		position: { x: 700, y: 100 },
		data: createWorkflowNodeData(workflowNodeDefinitions[3], {
			deletable: false,
		}),
	},
];

export const initialWorkflowEdges: WorkflowEdge[] = [
	{
		id: "edge-trigger-http",
		type: "workflow",
		source: "node-trigger",
		sourceHandle: "output",
		target: "node-http",
		targetHandle: "input",
		data: {},
	},
	{
		id: "edge-trigger-condition",
		type: "workflow",
		source: "node-trigger",
		sourceHandle: "output",
		target: "node-condition",
		targetHandle: "input",
		data: {},
	},
	{
		id: "edge-http-output",
		type: "workflow",
		source: "node-http",
		sourceHandle: "output",
		target: "node-output",
		targetHandle: "input",
		data: {},
	},
];
